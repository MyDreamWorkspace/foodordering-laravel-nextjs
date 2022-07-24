import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { allCategory, allMenus, featureCategory } from "../../api";
import Category from "../../components/Category";
import ItemContainer from "../../components/Items/ItemContainer";
import SingleItem from "../../components/Items/SingleItem";
import AppLayout from "../../components/Layouts/AppLayout";
import Loading from "../../components/Loading";
import Search from "../../components/Search";
import { CATEGORY, MENU } from "../../types/index";

interface Props {
  categories: CATEGORY[];
  featureCate: CATEGORY[];
}

const menu: NextPage<Props> = ({ categories, featureCate }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menus, setMenus] = useState<MENU[]>([]);
  const [loading, setLoading] = useState(false)
  
  const getMenuByCategory = async (category: string) => {
    const menu = await allMenus(category);
    setMenus(menu.data);
  };

  useEffect(() => {
    setLoading(true);
    if (selectedCategory !== "all") {
      getMenuByCategory(selectedCategory);
      setLoading(false)
    }
  }, [selectedCategory]);

  return (
    <AppLayout title="Menu">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-md font-bold text-textGray">Our Food</h1>
      <h2 className="text-xl mb-2 font-bold text-textGreen">Special For You</h2>
      <Search />
      <Category
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {selectedCategory === "all" ? (
        featureCate.map((category:CATEGORY)=>(
          <ItemContainer key={category.slug} title={category.name} menus={category.menus} />
        ))
      ) : (
        loading ? "Loading"  : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1">
          {menus.map((menu) => (
            <SingleItem key={menu.slug} menu={menu} />
          ))}
        </div>)
      )}
    </AppLayout>
  );
};

export async function getStaticProps() {
  const categories = await allCategory();
  const featureCate = await featureCategory();

  return {
    props: {
      categories: categories.data,
      featureCate: featureCate.data,
    },
  };
}

export default menu;
