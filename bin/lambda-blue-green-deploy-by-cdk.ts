#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BlueGreenSampleLambdaStack } from '../lib/blue-green-lambda-stack';
import { BlueGreenSampleApiStack } from '../lib/blue-green-api-stack';
import { BlueGreenSampleCicdStack } from '../lib/blue-green-cicd-stack';

interface Environment {
  projectName: string;
  stageName: string;
  githubBranchName: string;
}

const app = new cdk.App();

const projectName = app.node.tryGetContext('projectName');
const stageName = app.node.tryGetContext('stageName');
const env: Environment = app.node.tryGetContext(stageName);
const githubOwnerName = app.node.tryGetContext('githubOwnerName');
const githubRepositoryName = app.node.tryGetContext('githubRepositoryName');
const codestarConnectionArn = app.node.tryGetContext('codestarConnectionArn');
const commitHash = app.node.tryGetContext('commitHash');

env.projectName = projectName;
env.stageName = stageName;

const lambdaStack = new BlueGreenSampleLambdaStack(
  app,
  `${stageName}-${projectName}-lambda`,
  {
    ...env,
    commitHash,
  }
);
new BlueGreenSampleApiStack(app, `${stageName}-${projectName}-api`, {
  ...env,
  lambdaAlias: lambdaStack.lambdaAlias,
});
new BlueGreenSampleCicdStack(app, `${stageName}-${projectName}-cicd`, {
  ...env,
  githubOwnerName,
  githubRepositoryName,
  codestarConnectionArn,
});
