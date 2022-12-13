import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import useSwr from "swr";

import styles from "../styles/Home.module.css";
import fetcher from "../utils/fetcher";

interface User {
  _id: string;
  email: string;
  firstName: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  session: string;
  iat: number;
  exp: number;
}

const Home: NextPage<{ fallbackData: User }> = ({ fallbackData }) => {
  const { data } = useSwr<User | null>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
    { fallbackData }
  );

  console.log("data", data);
  if (data) {
    return <div>Welcome! {data.firstName}</div>;
  }

  return <div className={styles.container}>Please login</div>;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetcher(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    context.req.headers
  );
  return { props: { fallbackData: data } };
};

export default Home;
