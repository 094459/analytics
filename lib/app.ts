import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cert from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as sns from 'aws-cdk-lib/aws-sns';
// import {Swa} from "serverless-website-analytics/src"; // For the npm linked package one while testing
import {AllAlarmTypes, Swa} from 'serverless-website-analytics';

export class App extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* Optional, see descriptions on the `domain` property below. Needs tp cover the `domain.name` and
       {auth.cognito.loginSubDomain}.{domain.name}` domains and must be in us-east-1 even if your stack is
       somewhere else  */
    const wildCardCertUsEast1 = cert.Certificate.fromCertificateArn(this, 'Cert',
        'arn:aws:acm:us-east-1:xxxx:certificate/a58c22ba-e1cb-4b16-a74e-2f3da70ecxxx');

    const alarmTopic = new sns.Topic(this, "alarm-topic");
    new sns.Subscription(this, "alarm-topic-subscription", {
      topic: alarmTopic,
      protocol: sns.SubscriptionProtocol.EMAIL,
      endpoint: 'ricsue@amazon.co.uk',
    });

    new Swa(this, 'beachgeek-analytics', {
      environment: 'prod',
      awsEnv: {
        account: this.account,
        region: this.region,
      },
      sites: [
        'blog.beachgeek.co.uk',
      ],

      allowedOrigins: ['*'],
      /* Can be set explicitly instead of allowing all */
      // allowedOrigins: [
      //   'https://example.com',
      //   'https://www.example.com',
      //   'http://localhost:3000',
      //   'tests1',
      //   'tests2',
      // ],

      /* Specify one or the other, not both. Specifying neither means the site is unauthenticated, which is what we
         want for the Demo. */
      auth: {
        basicAuth: {
          username: 'xxxx',
          password: 'xxxx',
        },
      },
      //  auth: {
      //    cognito: {
      //      loginSubDomain: 'login', // This has to be unique across Cognito if not specifying your own domain
      //      users: [{
      //        name: 'Ricardo Sueiras',
      //        email: 'ricsue@amazon.co.uk',
      //      }]
      //    }
      //  },

      /* Optional, if not specified uses default CloudFront and Cognito domains */
      domain: {
        name: 'xxxxxxxxxx',
        certificate: wildCardCertUsEast1,
        /* Optional, if not specified then no DNS records will be created. You will have to create the DNS records yourself. */
        hostedZone: route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
          hostedZoneId: 'Z08557552NF1Q1JMUT38G',
          zoneName: 'xxxxxxxx',
        }),
        trackOwnDomain: true,
      },
      isDemoPage: false, /* Do not specify for your dashboard */

      observability: {
        dashboard: true,
        alarms: {
          alarmTopic,
          alarmTypes: AllAlarmTypes
        },
      }
    });

  }
}