import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Button, Text, Textarea, TextInput } from '@mantine/core';
import { Result } from "../../../../types/v2data";
import { axiosPublic } from "../../../api/axiosPublic";
import classes from "./see.module.css"
import MaterialSymbolsArrowBackRounded from "../../icons/MaterialSymbolsArrowBackRounded";
import TwemojiFlagUzbekistan from "../../icons/TwemojiFlagUzbekistan";
import TwemojiFlagRussia from "../../icons/TwemojiFlagRussia";
import FxemojiGreatbritainflag from "../../icons/FxemojiGreatbritainflag";
const SeeProduct = () => {
    const [dataUz, setUzData] = useState<Result>()
    const [dataEn, setEnData] = useState<Result>()
    const [dataRu, setRuData] = useState<Result>()

    const { id } = useParams()
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const res_uz = await axiosPublic("uz").get<Result>(`/products/${id}/`);
            const res_ru = await axiosPublic("ru").get<Result>(`/products/${id}/`);
            const res_en = await axiosPublic("en").get<Result>(`/products/${id}/`);
            setUzData(res_uz.data)
            setRuData(res_ru.data)
            setEnData(res_en.data)
        } catch (error) {
            console.log(error)
        }
    }, [id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div className={classes.productEdit}>
            <div className={classes.headerForm}>
                <div className={classes.goBackBtn} onClick={() => navigate(-1)}>
                    <Button size="md" leftSection={<MaterialSymbolsArrowBackRounded />} bg="#6EB648" className={classes.goBackBtn}>
                        Chiqish
                    </Button>
                </div>
                <Text c="#6EB648" size='xl' fw={500}> {dataUz?.title} </Text>
                <div className={classes.imgWrapper}>
                    <div className={classes.wrapperImages}>

                        <img
                            src={dataUz?.images[0]}
                            alt="Preview"
                        />
                    </div>
                </div>

            </div>
            <Text>Nomlar:</Text>
            <div className={classes.wrapperInputs} >
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >Nomi</span> <TwemojiFlagUzbekistan fontSize={18} />
                        </span>
                    }
                    placeholder="Ma'lumot"
                    value={dataUz?.title}
                    style={{ flex: "1" }}
                    size='md'
                    rows={4}
                />
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >Nomi</span> <TwemojiFlagRussia fontSize={18} />
                        </span>
                    }
                    placeholder="Информация"
                    value={dataRu?.title}
                    style={{ flex: "1" }}
                    size='md'
                    rows={4}
                />
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >Nomi</span> <FxemojiGreatbritainflag fontSize={18} />
                        </span>
                    }
                    placeholder="Description"
                    value={dataEn?.title}
                    style={{ flex: "1" }}
                    size='md'
                    rows={4}
                />
            </div>
            <Text>Ma'lumotlar:</Text>
            <div className={classes.wrapperInputs} >
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >Ma'lumot</span> <TwemojiFlagUzbekistan fontSize={18} />
                        </span>
                    }
                    placeholder="Ma'lumot"
                    value={dataUz?.description}
                    style={{ flex: "1" }}
                    size='md'
                    rows={8}
                />
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >Ma'lumot</span> <TwemojiFlagRussia fontSize={18} />
                        </span>
                    }
                    placeholder="Информация"
                    value={dataRu?.description}
                    style={{ flex: "1" }}
                    size='md'
                    rows={8}
                />
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >Ma'lumot</span> <FxemojiGreatbritainflag fontSize={18} />
                        </span>
                    }
                    placeholder="Description"
                    value={dataEn?.description}
                    style={{ flex: "1" }}
                    size='md'
                    rows={8}
                />
            </div>
            <Text>Tashqi ko'rinishilar:</Text>
            <div className={classes.wrapperInputs} >
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >Tashqi ko'rinishi</span> <TwemojiFlagUzbekistan fontSize={18} />
                        </span>
                    }
                    placeholder="Ma'lumot"
                    value={dataUz?.type_of_finish || ""}
                    style={{ flex: "1" }}
                    size='md'
                    rows={4}
                />
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >Tashqi ko'rinishi</span> <TwemojiFlagRussia fontSize={18} />
                        </span>
                    }
                    placeholder="Информация"
                    value={dataRu?.type_of_finish || ""}
                    style={{ flex: "1" }}
                    size='md'
                    rows={4}
                />
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >Tashqi ko'rinishi</span> <FxemojiGreatbritainflag fontSize={18} />
                        </span>
                    }
                    placeholder="Description"
                    value={dataEn?.type_of_finish || ""}
                    style={{ flex: "1" }}
                    size='md'
                    rows={4}
                />
            </div>
            <Text>O'ramlar:</Text>
            <div className={classes.wrapperInputs} >
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >Ishlab chiqaruvchi </span> <TwemojiFlagUzbekistan fontSize={18} />
                        </span>
                    }
                    placeholder="Ma'lumot"
                    value={dataUz?.made_in || ""}
                    style={{ flex: "1" }}
                    size='md'
                    rows={4}
                />
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >Ishlab chiqaruvchi</span> <TwemojiFlagRussia fontSize={18} />
                        </span>
                    }
                    placeholder="Информация"
                    value={dataRu?.made_in || ""}
                    style={{ flex: "1" }}
                    size='md'
                    rows={4}
                />
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >Ishlab chiqaruvchi</span> <FxemojiGreatbritainflag fontSize={18} />
                        </span>
                    }
                    placeholder="Description"
                    value={dataEn?.made_in || ""}
                    style={{ flex: "1" }}
                    size='md'
                    rows={4}
                />
            </div>
            <Text>Ishlab chiqaruvchi mamlakatlar:</Text>
            <div className={classes.wrapperInputs} >
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >O'ram </span> <TwemojiFlagUzbekistan fontSize={18} />
                        </span>
                    }
                    placeholder="Ma'lumot"
                    value={dataUz?.package || ""}
                    style={{ flex: "1" }}
                    size='md'
                    rows={4}
                />
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >O'ram </span> <TwemojiFlagRussia fontSize={18} />
                        </span>
                    }
                    placeholder="Информация"
                    value={dataRu?.package || ""}
                    style={{ flex: "1" }}
                    size='md'
                    rows={4}
                />
                <Textarea
                    label={
                        <span className={classes.inputLabelStyle}>
                            <span >O'ram</span> <FxemojiGreatbritainflag fontSize={18} />
                        </span>
                    }
                    placeholder="Description"
                    value={dataEn?.package || ""}
                    style={{ flex: "1" }}
                    size='md'
                    rows={4}
                />
            </div>
            <div className={classes.wrapperInputs}>
                <TextInput
                    label="Zichligi:"
                    value={dataUz?.density}
                    style={{ flex: "1", height: "60px" }}
                    size='md'
                    h={70}
                    w={20}
                    type='text'
                />
            </div>
        </div>
    )
}

export default SeeProduct