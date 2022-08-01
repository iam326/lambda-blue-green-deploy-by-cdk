import * as path from 'path';

import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';

export class BlueGreenApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambdaNodejs.NodejsFunction(
      this,
      'LambdaFunction',
      {
        functionName: 'blue-green-sample-function',
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
      restApiName: 'blue-green-sample-api',
    });
    restApi.root.addMethod(
      'GET',
      new apigateway.LambdaIntegration(lambdaAlias)
    );
  }
}
