export async function POST(req : any) {
    const data = await req.json();
    return new Response(JSON.stringify({ message: 'Product Created Successfully' }), {
      status: 200,
    });
  }
  