const createRecord = (body) => {
  return fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-type': `application/json`,
      },
    },
  )
}

const handleSubmit = async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
    })
  }

  const body = await request.formData()
  const { name, email, message } = Object.fromEntries(body)
  const reqBody = {
    fields: {
      Name: name,
      Email: email,
      Message: message,
    },
  }

  await createRecord(reqBody)

  return Response.redirect(FORM_URL)
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

// redirect url
const FORM_URL = 'http://localhost:3000'

async function handleRequest(request) {
  const url = new URL(request.url)

  // submit
  if (url.pathname === '/submit_form') {
    return handleSubmit(request)
  }

  return Response.redirect(FORM_URL)
}
