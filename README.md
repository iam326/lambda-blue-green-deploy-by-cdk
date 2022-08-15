# lambda-blue-green-deploy-by-cdk

【AWS CDK】CodePipeline で Lambda を Blue-Green デプロイする

## Deploy

### DEV

```
$ cdk deploy dev-blue-green-sample-cicd -c stageName=dev
$ cdk deploy dev-blue-green-sample-api -c stageName=dev
```

### STG

```
$ cdk deploy stg-blue-green-sample-cicd -c stageName=stg
$ cdk deploy stg-blue-green-sample-api -c stageName=stg
```

### PROD

```
$ cdk deploy prod-blue-green-sample-cicd -c stageName=prod
$ cdk deploy prod-blue-green-sample-api -c stageName=prod
```
