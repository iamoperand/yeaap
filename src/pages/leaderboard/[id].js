import React from 'react';
import { useRouter } from 'next/router';

const Leaderboard = () => {
  const router = useRouter();
  const { id } = router.query;

  return <p>Leaderboard: {id}</p>;
};

export default Leaderboard;
