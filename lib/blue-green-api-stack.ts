import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

interface BlueGreenApiStackProps extends StackProps {
  projectName: string;
  stageName: string;
  lambdaAlias: lambda.Alias;
}

export class BlueGreenApiStack extends Stack {
  constructor(scope: Construct, id: string, props: BlueGreenApiStackProps) {
    super(scope, id, props);

    const { projectName, stageName, lambdaAlias } = props;

    const restApi = new apigateway.RestApi(this, 'RestApi', {
      restApiName: `${stageName}-${projectName}-api`,
    });
    restApi.root.addMethod(
      'GET',
      new apigateway.LambdaIntegration(lambdaAlias)
    );
  }
}
