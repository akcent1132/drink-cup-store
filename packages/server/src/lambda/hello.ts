
export function handler(event:any, _: any, callback: any) {
    console.log(event)
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({msg: "Hello, World!"})
    })
  }