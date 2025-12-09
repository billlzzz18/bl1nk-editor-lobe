/**
 * Slack Webhook Integration
 * ส่งการแจ้งเตือนไปยัง Slack Workflow
 */

export interface SlackMessage {
  text: string;
  blocks?: any[];
  attachments?: any[];
}

/**
 * Send message to Slack via Webhook
 */
export async function sendSlackNotification(message: SlackMessage): Promise<boolean> {
  try {
    const response = await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    return false;
  }
}

/**
 * Send formatted notification for new user signup
 */
export async function notifyNewUserSignup(userEmail: string, userName: string) {
  return sendSlackNotification({
    text: `🎉 New user signed up!`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎉 New User Signup',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Name:*\n${userName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${userEmail}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Signed up at ${new Date().toISOString()}`,
          },
        ],
      },
    ],
  });
}

/**
 * Send formatted notification for errors
 */
export async function notifyError(error: Error, context?: string) {
  return sendSlackNotification({
    text: `🚨 Error occurred${context ? ` in ${context}` : ''}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 Error Alert',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Error:* ${error.message}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Stack:*\n\`\`\`${error.stack}\`\`\``,
        },
      },
      ...(context
        ? [
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: `Context: ${context}`,
                },
              ],
            },
          ]
        : []),
    ],
  });
}

/**
 * Send formatted notification for deployment
 */
export async function notifyDeployment(environment: string, version: string, success: boolean) {
  return sendSlackNotification({
    text: `${success ? '✅' : '❌'} Deployment ${success ? 'succeeded' : 'failed'}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${success ? '✅' : '❌'} Deployment ${success ? 'Succeeded' : 'Failed'}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Environment:*\n${environment}`,
          },
          {
            type: 'mrkdwn',
            text: `*Version:*\n${version}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Deployed at ${new Date().toISOString()}`,
          },
        ],
      },
    ],
  });
}

