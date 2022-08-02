import * as path from 'path';

import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';

interface BlueGreenLambdaStackProps extends StackProps {
  commitHash?: string;
}

export class BlueGreenLambdaStack extends Stack {
  public lambdaAlias: lambda.Alias;

  constructor(scope: Construct, id: string, props: BlueGreenLambdaStackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambdaNodejs.NodejsFunction(
      this,
      'LambdaFunction',
      {
        functionName: 'blue-green-sample-function',
        description: props.commitHash ? `Commit Hash: ${props.commitHash}` : '',
        runtime: lambda.Runtime.NODEJS_14_X,
        entry: path.join(__dirname, '../src/lambda/index.ts'),
        handler: 'handler',
        currentVersionOptions: {
          removalPolicy: RemovalPolicy.RETAIN,
        },
      }
    );
    this.lambdaAlias = lambdaFunction.currentVersion.addAlias('alias');
  }
}
