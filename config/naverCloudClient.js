import axios from "axios";
import crypto from "crypto";


const prepareSignature = (secretKey, method, serviceId, accessKey) => {
  const space = " ";
  const newLine = "\n";
  const message = [];
  const hmac = crypto.createHmac("sha256", secretKey);
  const url2 = `/sms/v2/services/${serviceId}/messages`;
  const timestamp = Date.now().toString();

  message.push(method);
  message.push(space);
  message.push(url2);
  message.push(newLine);
  message.push(timestamp);
  message.push(newLine);
  message.push(accessKey);

  const signature = hmac.update(message.join("")).digest("base64");

  return {
    timestamp,
    signature,
  };
}

  export const sendSMS = async({ phoneNumber, serviceId, secretKey, accessKey }, { to, content, countryCode = "82" }) => {
    try {
      const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
      const method = "POST";
  
      const { timestamp, signature } = prepareSignature(secretKey, method, serviceId, accessKey);
  
      const response = await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-ncp-apigw-timestamp": timestamp,
          "x-ncp-iam-access-key": accessKey,
          "x-ncp-apigw-signature-v2": signature,
        },
        data: {
          type: "LMS",
          contentType: "COMM",
          countryCode,
          from: phoneNumber,
          content,
          messages: [
            {
              to: `${to}`,
            },
          ],
        },
      });
  
      if (response.status === 202) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false };
    }
  }