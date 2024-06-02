exports.handler = async function(event, context) {
    const query = event.queryStringParameters.q;
    const apiKey = '6cb11221'; 
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
    const data = await response.json();
  
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  };
  