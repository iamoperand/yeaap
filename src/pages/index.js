import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useToasts } from 'react-toast-notifications';
import { isEmpty } from 'lodash';

import Layout from '../components/layout';
import SEO from '../components/seo';
import ActiveAuctions from '../components/active-auctions';
import Loading from '../components/loading';

import WalletIcon from '../assets/icons/wallet.svg?sprite';
import BirthdayIcon from '../assets/icons/birthday.svg?sprite';
import ShoutIcon from '../assets/icons/shout.svg?sprite';
import TimeIcon from '../assets/icons/time.svg?sprite';
import ChevronsRightIcon from '../assets/icons/chevrons-right.svg?sprite';

import rem from '../utils/rem';
import { getErrorMessage } from '../utils/error';

import { buttonPrimary, buttonRounded } from '../styles/button';

const GET_ACTIVE_AUCTIONS = gql`
  query getActiveAuctions {
    activeAuctions {
      id
      description
      isCanceled
      isSettled
      endsAt
      type
      hasBidsVisible

      creator {
        id
        name
      }
    }
  }
`;

// eslint-disable-next-line max-lines-per-function
const Index = () => {
  const { addToast } = useToasts();
  const { loading: isAuctionLoading, data } = useQuery(GET_ACTIVE_AUCTIONS, {
    onError: (error) => {
      const errorMessage = getErrorMessage(
        error,
        'An error occurred while updating the auction'
      );
      addToast(errorMessage, {
        appearance: 'error'
      });
    }
  });

  return (
    <Layout>
      <SEO />
      <InfoGrid>
        <div>
          <div
            css={css`
              margin-bottom: ${rem(10)};
            `}
          >
            <H1>Seamless</H1>
            <H1 css={underlineStyles}>online auctions.</H1>
          </div>
          <Text>
            We take care of all the needless complexity, to help you get up and
            running within a few minutes.
          </Text>
        </div>
        <WalletIcon
          css={css`
            width: 100%;
          `}
        />
      </InfoGrid>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: ${rem(140)};
        `}
      >
        <H1 css={underlineStyles}>{"It's so simple"}</H1>
        <Text
          css={css`
            margin-top: ${rem(6)};
          `}
        >
          {"You'll fall in love with it."}
        </Text>
      </div>
      <FeaturesRow>
        <Feature>
          <BirthdayIcon css={featureIconStyles} />
          <IconText>Create auction</IconText>
          <IconParagraph>
            Have your auction created within a few minutes.
          </IconParagraph>
        </Feature>
        <ChevronsRightIcon css={arrowIconStyles} />
        <Feature>
          <ShoutIcon css={featureIconStyles} />
          <IconText>Let others know</IconText>
          <IconParagraph>
            Share the auction with your potential bidders.
          </IconParagraph>
        </Feature>
        <ChevronsRightIcon css={arrowIconStyles} />
        <Feature>
          <TimeIcon css={featureIconStyles} />
          <IconText>Track progress</IconText>
          <IconParagraph>
            Monitor how your auction is performing in real-time.
          </IconParagraph>
        </Feature>
      </FeaturesRow>
      <CTASection>
        <H3 css={underlineStyles}>{"Let's get you started"}</H3>
        <Text
          css={css`
            margin-top: ${rem(6)};
          `}
        >
          {'In absolutely no time.'}
        </Text>
        <CTAButton>Create auction</CTAButton>
      </CTASection>
      <AuctionsSection>
        {isAuctionLoading ? (
          <Loading />
        ) : (
          !isEmpty(data.activeAuctions) && (
            <>
              <H3 css={underlineStyles}>Still not convinced?</H3>
              <Text
                css={css`
                  margin-top: ${rem(6)};
                `}
              >
                Take a look at <b>active</b> auctions.
              </Text>

              <ActiveAuctions auctions={data.activeAuctions} />
            </>
          )
        )}
      </AuctionsSection>
    </Layout>
  );
};

export default Index;

/*
 ********************************************
 styled components
 ********************************************
 */

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr ${rem(330)};
  grid-column-gap: ${rem(70)};
  align-items: flex-end;
`;

const H1 = styled.div`
  font-size: ${rem(40)};
  color: #293845;
  font-weight: 500;
`;

const underlineStyles = css`
  display: inline-block;
  background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  background-repeat: no-repeat;
  background-size: 100% 0.2em;
  background-position: 0 88%;
  transition: background-size 0.25s ease-in;
  &:hover {
    background-size: 100% 100%;
  }
`;

const H3 = styled.div`
  font-size: ${rem(30)};
  color: #293845;
  font-weight: 500;
`;

const Text = styled.div`
  color: #788896;
  font-size: ${rem(18)};
`;

const arrowIconStyles = css`
  width: ${rem(30)};
  height: ${rem(30)};
  color: #788896;
`;

const featureIconStyles = css`
  width: ${rem(40)};
  height: ${rem(40)};
`;

const IconText = styled.div`
  color: #293845cc;
  font-size: ${rem(22)};
  margin-top: ${rem(10)};
  font-weight: 500;
  text-align: center;
`;

const IconParagraph = styled.div`
  color: #788896;
  margin-top: ${rem(5)};
  text-align: center;
`;

const FeaturesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: ${rem(40)};
`;

const Feature = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0 ${rem(20)};
  :first-child {
    padding-left: 0;
  }
  :last-child {
    padding-right: 0;
  }
`;

const CTASection = styled.div`
  margin-top: ${rem(120)};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CTAButton = styled.button`
  ${buttonPrimary};
  ${buttonRounded};

  margin-top: ${rem(20)};
  padding: ${rem(10)} ${rem(30)};
  font-size: ${rem(20)};
`;

const AuctionsSection = styled.div`
  margin-top: ${rem(100)};
  display: flex;
  flex-direction: column;
  align-items: center;
`;
