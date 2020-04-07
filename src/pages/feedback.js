import React from 'react';
import { css } from '@emotion/core';
import Script from 'react-load-script';

import Layout from '../components/layout';
import SEO from '../components/seo';

const Feedback = () => {
  return (
    <Layout>
      <SEO title="Feedback" />

      <iframe
        className="airtable-embed airtable-dynamic-height"
        title="feedback-form"
        src="https://airtable.com/embed/shrSZUY5xWOZxqCyW?backgroundColor=pink"
        width="100%"
        height="999"
        frameBorder="0"
        css={css`
          background: transparent;
          border: 1px solid #ccc;
          border-top: 2px solid #cccccccc;
        `}
      ></iframe>

      <Script
        url={'https://static.airtable.com/js/embed/embed_snippet_v1.js'}
      />
    </Layout>
  );
};

export default Feedback;
