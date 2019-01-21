import { CostExplorer, AutoScaling, CloudWatch } from 'aws-sdk'
import moment from 'moment'

const apiRequest = () => {
    const costExplorer = new CostExplorer({ region: 'us-east-1' });
    const autoScaling = new AutoScaling({ region: 'eu-west-1' });
    const cloudwatch = new CloudWatch({ region: 'eu-west-1' });

    const apiMethods = {
        cost() {
            const today = moment();
            const yesterday = moment().subtract(1, 'day');

            const pramas = {
                Granularity: 'DAILY',
                TimePeriod: {
                    Start: yesterday.format('YYYY-MM-DD'),
                    End: today.format('YYYY-MM-DD')
                },
                Metrics: [
                    'BlendedCost'
                ],
            }
            return costExplorer.getCostAndUsage(pramas).promise()
                .then(res => res.ResultsByTime);
        },

        scaling(params) {
            const pramas = {
                AutoScalingGroupNames: [
                    params.name
                ]
            }

            return autoScaling.describeAutoScalingGroups(pramas).promise();
        },

        alarm() {
            const params = {
                StateValue: 'ALARM'
            }

            return cloudwatch.describeAlarms(params).promise()
                .then(res => res.MetricAlarms)
        }
    }

    return apiMethods;
};

export {
    apiRequest
}