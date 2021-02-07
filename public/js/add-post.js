async function newFormHandler(event)
{
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value.trim();
  const post_url = document.querySelector('input[name="post-url"]').value.trim();

  const res = await fetch('/api/posts',
  {
    method: 'POST',
    body: JSON.stringify({ title, post_url }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.ok) document.location.replace('/dashboard');
  else alert(response.statusText);
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);
