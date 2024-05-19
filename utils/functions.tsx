const sleep = (n:number)=> {
    return new Promise((resolve) => setTimeout(resolve, n));
  }
  export default sleep;
export const get_package = async (n:number)=> {
   return fetch('/api/get_template', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
        body: JSON.stringify({
          id: n,
        }),
  }).then(async (res) => {
    const data = await res.json();
    console.log(data)
    return data;
}).catch((error) => {
    console.error('Error:', error);
})
  }  