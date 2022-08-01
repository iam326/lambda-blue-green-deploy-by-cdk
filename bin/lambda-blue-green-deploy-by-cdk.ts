#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BlueGreenApiStack } from '../lib/blue-green-api-stack';
import { BlueGreenCicdStack } from '../lib/blue-green-cicd-stack';

const app = new cdk.App();
new BlueGreenApiStack(app, 'blue-green-api-stack', {});
new BlueGreenCicdStack(app, 'blue-green-cicd-stack', {
  githubOwnerName: 'iam326',
  githubRepositoryName: 'lambda-blue-green-deploy-by-cdk',
  branchName: 'main',
  codestarConnectionArn: '',
});
