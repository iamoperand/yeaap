import Router from 'next/router';

const redirectWithSSR = ({ res, path }) => {
  // res is available only on the server
  if (res) {
    res.redirect(path);
    res.end();
    return;
  }

  Router.replace(path);
};

export default redirectWithSSR;
