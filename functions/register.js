exports.handler = async function(event, context) {
    const secretCode = JSON.parse(event.body).secretCode;
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success!' }),
    };
  };
  