import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

const SEO = ({ title = 'Home', description = 'The bidding app', url }) => {
  return (
    <Head>
      {/* General tags */}
      <title>{`${title} | Yeaap!`}</title>
      <meta name="description" content={description} />
      {/* <meta name="image" content={image} /> */}

      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* <meta property="og:image" content={image} /> */}
      {/* <meta property="fb:app_id" content={fbAppID} /> */}

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      {/* <meta name="twitter:creator" content={twitterId} /> */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* <meta name="twitter:image" content={image} /> */}
    </Head>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string
};

export default SEO;
