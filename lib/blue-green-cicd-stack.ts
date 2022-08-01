import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codeBuild from 'aws-cdk-lib/aws-codebuild';
import * as codePipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codePipelineActions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface BlueGreenCicdStackProps extends StackProps {
  githubOwnerName: string;
  githubRepositoryName: string;
  branchName: string;
  codestarConnectionArn: string;
}

export class BlueGreenCicdStack extends Stack {
  constructor(scope: Construct, id: string, props: BlueGreenCicdStackProps) {
    super(scope, id, props);

    const {
      githubOwnerName,
      githubRepositoryName,
      branchName,
      codestarConnectionArn,
    } = props;

    const sourceArtifact = new codePipeline.Artifact();
    const sourceAction =
      new codePipelineActions.CodeStarConnectionsSourceAction({
        actionName: 'source',
        owner: githubOwnerName,
        repo: githubRepositoryName,
        branch: branchName,
        connectionArn: codestarConnectionArn,
        output: sourceArtifact,
      });

    const codeBuildServiceRole = new iam.Role(this, 'CodeBuildServiceRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      path: '/',
      inlinePolicies: {
        codeBuildServicePolicies: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                // 'lambda:GetFunction',
                // 'lambda:GetFunctionConfiguration',
                // 'lambda:UpdateFunctionCode',
                // 'lambda:UpdateFunctionConfiguration',
                'lambda:PublishVersion',
                'lambda:UpdateAlias',
              ],
              resources: [
                `arn:aws:lambda:${this.region}:${this.account}:function:blue-green-sample-function`,
              ],
            }),
          ],
        }),
      },
    });

    const codeBuildDeployProject = new codeBuild.PipelineProject(
      this,
      'CodeBuildDeployProject',
      {
        projectName: `${githubRepositoryName}-deploy-project`,
        buildSpec: codeBuild.BuildSpec.fromSourceFilename('./buildspec.yml'),
        role: codeBuildServiceRole,
        environment: {
          buildImage: codeBuild.LinuxBuildImage.AMAZON_LINUX_2_3,
          computeType: codeBuild.ComputeType.SMALL,
        },
      }
    );

    const deployAction = new codePipelineActions.CodeBuildAction({
      actionName: 'deploy',
      project: codeBuildDeployProject,
      input: sourceArtifact,
    });

    new codePipeline.Pipeline(this, 'DeployPipeline', {
      pipelineName: `${githubRepositoryName}-deploy-pipeline`,
      stages: [
        {
          stageName: 'source',
          actions: [sourceAction],
        },
        {
          stageName: 'deploy',
          actions: [deployAction],
        },
      ],
    });
  }
}
