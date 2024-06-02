export const handler = async function(event) {
    const query = event.queryStringParameters.q;
    console.log('query: ', query);
    const apiKey = '6cb11221'; 
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
    console.log('Response: ', response);
    const data = await response.json();
    console.log('Data: ', data);
  
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  };
  