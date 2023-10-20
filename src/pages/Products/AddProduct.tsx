import { Button, Tabs } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { TProductType } from "../../../types/v2data";
import { getSubcategories } from "../../api/data";
import styles from "../page.module.css";
import Five from "./Tabs/Five";
import Four from "./Tabs/Four";
import One from "./Tabs/One";
import Three from "./Tabs/Three";
import Two from "./Tabs/Two";

const AddProduct = () => {
  const [value, setValue] = useLocalStorage<TProductType>({ key: 'ptype', defaultValue: 'RMP' });

  const navigate = useNavigate();
  const [subs, setSubs] = useState<{value: string, label: string}[]>([])
  
  
  const fetchSubcategories = useCallback(async() => {
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

  useEffect(() => {
    fetchSubcategories()
  }, [fetchSubcategories])

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
            <One subs={subs}/>
          </Tabs.Panel>

          <Tabs.Panel value="FFP">
            <Two subs={subs}/>
          </Tabs.Panel>

          <Tabs.Panel value="FP">
            <Three subs={subs} />
          </Tabs.Panel>

          <Tabs.Panel value="DP">
            <Four subs={subs}/>
          </Tabs.Panel>

          <Tabs.Panel value="ABP">
            <Five subs={subs}/>
          </Tabs.Panel>
        </Tabs>
      </div>

      <Toaster />
    </div>
  );
};

export default AddProduct;
