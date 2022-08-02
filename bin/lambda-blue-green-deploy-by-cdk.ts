#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BlueGreenLambdaStack } from '../lib/blue-green-lambda-stack';
import { BlueGreenApiStack } from '../lib/blue-green-api-stack';
import { BlueGreenCicdStack } from '../lib/blue-green-cicd-stack';

const app = new cdk.App();
const commitHash = app.node.tryGetContext('commitHash');

const lambda = new BlueGreenLambdaStack(app, 'blue-green-lambda-stack', {
  commitHash,
});
new BlueGreenApiStack(app, 'blue-green-api-stack', {
  lambdaAlias: lambda.lambdaAlias,
});
new BlueGreenCicdStack(app, 'blue-green-cicd-stack', {
  githubOwnerName: 'iam326',
  githubRepositoryName: 'lambda-blue-green-deploy-by-cdk',
  branchName: 'main',
  codestarConnectionArn: '',
});
