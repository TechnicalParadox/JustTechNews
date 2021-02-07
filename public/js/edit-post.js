async function editFormHandler(event)
{
  event.preventDefault();
  const post_id = window.location.toString().split('/')[window.location.toString().split('/').length-1];
  const title = document.querySelector('input[name="post-title"]').value.trim();

  const res = await fetch('/api/posts/'+post_id,
  {
    method: 'PUT',
    body: JSON.stringify({ title }),
    headers: { 'Content-Type': 'application/json' }
  });

  console.log(res);
  if (res.ok) document.location.replace('/dashboard/');
  else alert(res.statusText);
}

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);
