#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { App } from '../lib/app';
import {Tags} from "aws-cdk-lib";

const app = new cdk.App();

const swaStack = new App(app, 'beachgeek-analytics', {
  env: {
    account: 'xxxxxxxx', 
    region: 'eu-west-1',
  },
});

/* Adds tags to all the resources for billing purposes */
Tags.of(swaStack).add('App', 'beachgeek-analytics');