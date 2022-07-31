#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaBlueGreenDeployByCdkStack } from '../lib/lambda-blue-green-deploy-by-cdk-stack';

const app = new cdk.App();
new LambdaBlueGreenDeployByCdkStack(app, 'LambdaBlueGreenDeployByCdkStack', {});
