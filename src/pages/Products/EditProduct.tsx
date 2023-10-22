import { Button, Tabs } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Result, TProductType } from "../../../types/v2data";
import { axiosPublic } from "../../api/axiosPublic";
import { getSubcategories } from "../../api/data";
import styles from "../page.module.css";
import Five from "./Edit/Five";
import Four from "./Edit/Four";
import One from "./Edit/One";
import Three from "./Edit/Three";
import Two from "./Edit/Two";


const EditProduct = () => {
  const [dataUz, setUzData] = useState<Result | null>(null)
  const [dataEn, setEnData] = useState<Result | null>(null)
  const [dataRu, setRuData] = useState<Result | null>(null)

  const [value, setValue] = useLocalStorage<TProductType>({ key: 'ptype', defaultValue: 'RMP' });
  const navigate = useNavigate();
  const { id } = useParams()
  const [subs, setSubs] = useState<{ value: string, label: string }[]>([])

  const fetchSubcategories = useCallback(async () => {
    try {
      const res_uz = await getSubcategories("uz")
      const arr = res_uz?.data.map((item) => {
        return {
          value: `${item.id}`,
          label: item.title
        }
      })
      setSubs(arr ? arr : [])
    } catch (error) {
      console.log(error)
    }
  }, [])


  const fetchData = useCallback(async () => {
    try {
      const res_uz = await axiosPublic("uz").get<Result>(`/products/${id}/`);
      const res_ru = await axiosPublic("ru").get<Result>(`/products/${id}/`);
      const res_en = await axiosPublic("en").get<Result>(`/products/${id}/`);

      setUzData(res_uz.data)
      setRuData(res_ru.data)
      setEnData(res_en.data)
      setValue(res_uz.data.product_type as TProductType)
    } catch (error) {
      console.log(error)
    }
  }, [id, setValue])

  useEffect(() => {
    fetchSubcategories()
    fetchData()
  }, [fetchSubcategories, fetchData])

  return (
    <div className={styles.products_container}>
      <div className={styles.headerContent}>
        <Button variant="default" onClick={() => navigate(-1)}>
          ORQAGA
        </Button>
      </div>

      <div className={styles.tabsContent}>
        <Tabs defaultValue={value} value={value} onChange={(e: TProductType) => setValue(e)}>
          <Tabs.List>
            <Tabs.Tab value="RMP" >
              Xomashyo mahsulot
            </Tabs.Tab>
            <Tabs.Tab value="FFP">
              Tayyor mato
            </Tabs.Tab>
            <Tabs.Tab value="FP">
              Tayyor mahsulot
            </Tabs.Tab>

            <Tabs.Tab value="DP">
              Dekorativ mahsulot
            </Tabs.Tab>

            <Tabs.Tab value="ABP">
              Aktiv ko'rpachalik mahsulot
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="RMP">
            <One subs={subs} en_data={dataEn} ru_data={dataRu} uz_data={dataUz} />
          </Tabs.Panel>

          <Tabs.Panel value="FFP">
            <Two subs={subs} en_data={dataEn} ru_data={dataRu} uz_data={dataUz} />
          </Tabs.Panel>

          <Tabs.Panel value="FP">
            <Three subs={subs} en_data={dataEn} ru_data={dataRu} uz_data={dataUz} />
          </Tabs.Panel>

          <Tabs.Panel value="DP">
            <Four subs={subs} en_data={dataEn} ru_data={dataRu} uz_data={dataUz} />
          </Tabs.Panel>

          <Tabs.Panel value="ABP">
            <Five subs={subs} en_data={dataEn} ru_data={dataRu} uz_data={dataUz} />
          </Tabs.Panel>
        </Tabs>
      </div>

      <Toaster />
    </div>
  );
};

export default EditProduct;
