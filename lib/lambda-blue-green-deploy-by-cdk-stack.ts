import * as path from 'path';

import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_lambda_nodejs as node_lambda } from 'aws-cdk-lib';

export class LambdaBlueGreenDeployByCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFunction = new node_lambda.NodejsFunction(
      this,
      'LambdaBlueGreenDeployByCdkFunction',
      {
        functionName: 'LambdaBlueGreenDeployByCdkFunction',
        description: `Generated on: ${new Date().toISOString()}`,
        runtime: lambda.Runtime.NODEJS_14_X,
        entry: path.join(__dirname, '../src/lambda/index.ts'),
        handler: 'handler',
        currentVersionOptions: {
          removalPolicy: RemovalPolicy.RETAIN,
        },
      }
    );
    const lambdaAlias = lambdaFunction.currentVersion.addAlias('alias');

    const restApi = new apigateway.RestApi(this, 'RestApi', {
      restApiName: 'LambdaBlueGreenDeployByCdkFunctionApi',
    });
    restApi.root.addMethod(
      'GET',
      new apigateway.LambdaIntegration(lambdaAlias)
    );
  }
}
