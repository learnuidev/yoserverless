const DynamoDB = require('aws-sdk/clients/dynamodb')

const DocumentClient = new DynamoDB.DocumentClient()

const { USERS_TABLE } = process.env

module.exports.handler = async event => {
  if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const firstName = event.request.userAttributes['custom:firstName']
    const lastName = event.request.userAttributes['custom:lastName']

    const newUser = {
      id: event.userName,
      firstName,
      lastName,
      comradesCount: 0,
      fleetsCount: 0,
      createdAt: new Date().toJSON()
    }

    await DocumentClient.put({
      TableName: USERS_TABLE,
      Item: newUser,
      // This will prevent data duplication
      ConditionExpression: 'attribute_not_exists(id)'
    }).promise()

    return event
  }

  return event
}
