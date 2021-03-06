import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { isEmpty, get } from 'lodash';
import { useModal } from 'react-modal-hook';
import { useRouter } from 'next/router';

import Layout from '../components/layout';
import SEO from '../components/seo';
import ActiveAuctions from '../components/active-auctions';
import Loading from '../components/loading';
import AuthModal from '../components/modal/auth';

import WalletIcon from '../assets/icons/wallet.svg?sprite';
import BirthdayIcon from '../assets/icons/birthday.svg?sprite';
import ShoutIcon from '../assets/icons/shout.svg?sprite';
import TimeIcon from '../assets/icons/time.svg?sprite';
import ChevronsRightIcon from '../assets/icons/chevrons-right.svg?sprite';

import rem from '../utils/rem';
import theme from '../utils/theme';

import useSession from '../hooks/use-session';

import { buttonPrimary, buttonRounded, buttonDisabled } from '../styles/button';

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
  const { user, isUserLoading } = useSession();

  const { loading: isAuctionLoading, data } = useQuery(GET_ACTIVE_AUCTIONS);

  const [showAuthModal, hideAuthModal] = useModal(() => (
    <AuthModal
      onClose={hideAuthModal}
      onLogin={() => router.push('/auction/new')}
    />
  ));

  const router = useRouter();

  const handleCreateAuctionClick = () => {
    if (!user) {
      showAuthModal();
      return;
    }
    router.push('/auction/new');
  };

  const isCTADisabled = isUserLoading;

  return (
    <Layout>
      <SEO />
      <InfoGrid>
        <div
          css={css`
            grid-area: text;
          `}
        >
          <div
            css={css`
              margin-bottom: ${rem(10)};
              text-align: center;

              @media screen and (min-width: ${theme.breakpoints.tablet}) {
                text-align: left;
              }
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
        <div
          css={css`
            grid-area: image;
            text-align: center;

            @media screen and (min-width: ${theme.breakpoints.tablet}) {
              text-align: left;
            }
          `}
        >
          <WalletIcon
            css={css`
              width: ${rem(330)};
              order: 1;
            `}
          />
        </div>
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
        <CTAButton disabled={isCTADisabled} onClick={handleCreateAuctionClick}>
          Create auction
        </CTAButton>
      </CTASection>

      <AuctionsSection>
        {isAuctionLoading ? (
          <Loading />
        ) : (
          !isEmpty(get(data, 'activeAuctions')) && (
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
  grid-template-areas: 'image' 'text';
  grid-template-columns: 1fr;
  grid-row-gap: ${rem(40)};
  justify-content: center;

  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    grid-template-areas: 'text image';
    grid-template-columns: 1fr ${rem(330)};
    grid-column-gap: ${rem(70)};
    align-items: flex-end;
    justify-content: start;
  }
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
  text-align: center;

  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    text-align: inherit;
  }
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
  margin-top: ${rem(10)};
  font-weight: 500;
  text-align: center;

  font-size: ${rem(18)};
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    font-size: ${rem(22)};
  }
`;

const IconParagraph = styled.div`
  display: none;

  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    display: block;
    color: #788896;
    margin-top: ${rem(5)};
    text-align: center;
  }
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
  ${buttonDisabled};

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
