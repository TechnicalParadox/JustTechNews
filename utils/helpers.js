module.exports =
{
  format_date: date =>
  {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
  },
  format_plural: (str, int) =>
  {
    return parseInt(int) === 1 ? str : str+"s";
  },
  format_url: (url) =>
  {
    url = url.split('.');
    let begining, end;
    if (url.length === 2)
    {
      beginning = url[0].split('/');
      beginning = beginning[beginning.length - 1];
      end = url[1].split('/')[0];
    }
    else
    {
      beginning = url[1];
      end = url[2].split('/')[0];
    }
    end = end.split('?')[0];
    
    return beginning + '.' + end;
  }
}
