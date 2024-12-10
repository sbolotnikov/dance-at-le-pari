 
const {Client } = require('pg')

 export const listenForChanges= async()=> {
     
       
      const client = new Client({
        connectionString: process.env.DIRECT_URL,
      })
       
      client.connect((err: Error | null, client: any, done: () => void) => {
        if (err) {
          console.log('Error connecting to database', err);
        }else {
          console.log('Connected to database');
          client.on('notification', async (msg:any) => {
            const payload = JSON.parse(msg.payload);
            console.log('Change detected:', payload);

            if (payload.action === 'INSERT') {
              console.log('New party added:', payload.data);
            } else if (payload.action === 'UPDATE') {
              console.log('Party updated:', payload.data);
            } else if (payload.action === 'DELETE') {
              console.log('Party deleted:', payload.data);
            }
          });
          client.query('update_check')
        }
      })
  }