import { useEffect, useState } from "react"
import { Card, Text, Box } from '@mantine/core';
import classes from "./dashbord.module.css"
import { getAchievements, getBlogs, getCategories, getGalleries, getNews, getProducts, getStatistics } from '../../api/data';
import CountUp from 'react-countup';
import { Link } from "react-router-dom";
import MaterialSymbolsGalleryThumbnailOutlineRounded from "../icons/MaterialSymbolsGalleryThumbnailOutlineRounded";
import MaterialSymbolsCategoryOutlineRounded from "../icons/MaterialSymbolsCategoryOutlineRounded";
import GameIconsAchievement from "../icons/GameIconsAchievement";
import CarbonBlog from "../icons/CarbonBlog";
import IonNewspaperOutline from "../icons/IonNewspaperOutline";
import MaterialSymbolsAddShoppingCartRounded from "../icons/MaterialSymbolsAddShoppingCartRounded";
import AkarIconsStatisticUp from "../icons/AkarIconsStatisticUp";

const DashbordPage = () => {
  const [stats, setStats] = useState<{
    cats?: number;
    achievements?: number;
    blogs?: number;
    galleries?: number;
    news?: number;
    products?: number;
    statistics?: number
  }>({})

  const fetchData = async () => {
    try {
      const [ cats, achievements, blogs, galleries, news, products, statistics] = await Promise.all([getCategories(), getAchievements(), getBlogs(), getGalleries(), getNews(), getProducts(), getStatistics()])
      setStats({
        cats: cats?.data.length,
        achievements: achievements?.data.length,
        blogs: blogs?.data.count,
        galleries: galleries?.data.length,
        news: news?.data.count,
        products: products?.data.count,
        statistics: statistics?.data.length
      })
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  
  const data = [
    { label: "Categoryalar", icon: MaterialSymbolsCategoryOutlineRounded, color: "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)", link: "/categories" , count: stats.cats},
    { label: "Yutuqlar", icon: GameIconsAchievement, color: "linear-gradient(to right, #8360c3, #2ebf91)", link: "/achievement" , count: stats.achievements},
    { label: "Galereyalar", icon: MaterialSymbolsGalleryThumbnailOutlineRounded, color: "linear-gradient(to right, #2c3e50, #4ca1af)", link: "/galleries" , count: stats.galleries}, 
    { label: "Statistika", icon: AkarIconsStatisticUp, color: "linear-gradient(to right, #ff6e7f, #bfe9ff)", link: "/statistics" , count: stats.statistics},    
    { label: "Blog", icon: CarbonBlog, color: "linear-gradient(to right, #fc5c7d, #6a82fb)", link: "/blog" , count: stats.blogs },    
    { label: "Yangiliklar", icon: IonNewspaperOutline, color: "linear-gradient(to right, #00b09b, #96c93d)", link: "/news" , count: stats.news}, 
    { label: "Mahsulotlar", icon: MaterialSymbolsAddShoppingCartRounded, color: "radial-gradient( circle 759px at -6.7% 50%, rgba(80,131,73,1) 0%, rgba(140,209,131,1) 26.2%, rgba(178,231,170,1) 50.6%, rgba(144,213,135,1) 74.1%, rgba(75,118,69,1) 100.3% )", link: "/products" , count: stats.products},
  ]
  const cards = data.map((e) =>
    <Link
      className={classes.link}
      to={e.link}
      key={e.label}
    >
      <Card shadow="sm" padding="lg" className={classes.dashbord_card} style={{backgroundImage: e.color}} radius="md" withBorder>
        <div>
          <Text className={classes.dashbord_number}>
            <CountUp end={e.count ? e.count : 0} delay={80} />
          </Text>
          <Text className={classes.dashbord_title}>
            {e.label}
          </Text>
        </div>
        <div>
          <e.icon fontSize={42} color="#fff"/>
        </div>
      </Card>
    </Link>
  )
  
  return (
    <Box p={20} className={classes.dashbord}>
        <div className={classes.wrapper}>
      {cards}
        </div>
    </Box>
  );
}

export default DashbordPage