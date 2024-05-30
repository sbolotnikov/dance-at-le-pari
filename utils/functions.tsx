const sleep = (n:number)=> {
    return new Promise((resolve) => setTimeout(resolve, n));
  }
  export default sleep;

  export const slugify = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

export const get_package = async (n:number[])=> {
   return fetch('/api/get_template', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
        body: JSON.stringify({
          arr: n,
        }),
  }).then(async (res) => {
    const data = await res.json();
    console.log(data)
    return data;
}).catch((error) => {
    console.error('Error:', error);
})
  }  