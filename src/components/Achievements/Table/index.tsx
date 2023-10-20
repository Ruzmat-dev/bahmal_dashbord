import { useEffect, useRef, useState } from 'react';
import {
    Text,
} from '@mantine/core';
import classes from './AchievementsTable.module.css';
import MaterialSymbolsDeleteOutlineRounded from '../../icons/MaterialSymbolsDeleteOutlineRounded';
import { modals } from '@mantine/modals';
import { axiosPrivate } from '../../../api/axiosPrivate';
import toast, { Toaster } from 'react-hot-toast';
import MaterialSymbolsEditOutlineRounded from '../../icons/MaterialSymbolsEditOutlineRounded';
import { getAchievements } from '../../../api/data';
import { TAchievement } from '../../../../types/data';
import MaterialSymbolsDownload from '../../icons/MaterialSymbolsDownload';
import { AxiosError } from 'axios';
import { convertImageToFileURL } from '../../../utils/helpers';
import "./style.css"



export default function AchievementsTable() {
    const [achievements, setAchievements] = useState<TAchievement[]>()
    const [previewURL, setPreviewImage] = useState<File>();
    // const [selectedFile, setSelectedFile] = useState<string>("");
    const [, setLoading] = useState<boolean>(false)
    const [imageUrl, setImageUrl] = useState<string>("")

    const fileRef = useRef<HTMLInputElement | null>(null)

    const handleDelete = async (id: number) => {
        try {
            await axiosPrivate.delete(`/achievements/${id}/`)
            toast.success('Movafiqiyatli!')
            fetchData()

        } catch (error) {
            toast.error('O`chirishda xatolik yuz berdi!');
        }
    };


    const fetchData = async () => {
        try {
            const res = await getAchievements()
            setAchievements(res?.data)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchData()
    }, [])

    const openDeleteModal = (e: TAchievement) => {
        modals.openConfirmModal({
            centered: true,
            children: (
                <Text size="sm">
                    Siz haqiqatan ham bu mahsulotni ochirmoqchimisiz
                </Text>
            ),
            labels: { confirm: 'xa', cancel: "yuq" },
            confirmProps: { color: 'red' },
            onConfirm: () => handleDelete(e.id),
        })
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setPreviewImage(files[0])
            const url_image = await convertImageToFileURL(files[0])
            if (typeof url_image === "string") {
                setImageUrl(url_image)
            }
        }
    }



    const openModal = (e: TAchievement) => modals.openConfirmModal({

        

        title: 'Ozgartirish',
        children: (
            <>
                <div className={classes.ModalimgWrapper}>
                    <div className={classes.ModalimgWrapperItem} onClick={() => fileRef.current?.click()}>
                        <span>
                            <MaterialSymbolsDownload fontSize={56} color='#6EB648' />
                        </span>
                    </div>
                    <div className={classes.ModalwrapperImages}>
                        <input
                            hidden
                            ref={fileRef}
                            accept='image/*'
                            onChange={handleFileChange}
                            type="file"
                            id="picture"
                        />

                        <img    
                            src={imageUrl ? imageUrl : e.image}
                            alt="Preview"
                        />

                    </div>
                </div>
                {/* <Button loading={loading} disabled={loading} className={classes.send} bg="#6EB648" onClick={postAchievements}> Yuborish </Button> */}
            </>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },

        onCancel: () => console.log('Cancel'),
        onConfirm: () => postAchievements(e.id),
    });

    const postAchievements = async (id: number) => {
        setLoading(true);


        try {
            const formData = new FormData();
            formData.append('image', previewURL!);
            console.log(previewURL);
            
            await axiosPrivate.put(`/achievements/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Movafiqiyatli Qoshildi!');
            setLoading(false);
            close()
            fetchData()
        } catch (error) {
            const axiosError = error as AxiosError;
            console.log(error);

            const myError = axiosError.request?.status ?? 0;
            const errorNumber = Math.floor(myError / 100);

            if (errorNumber === 4) {
                toast.error('Xato malumot kiritildi!');
            } else if (errorNumber === 5) {
                toast.error('Uzir hatoliq yuz berdi!');
            } else {
                toast.error('Internet aloqasi yo`q!');
            }
            setLoading(false)
            close()
        }
    }


    return (
        <div className={classes.catalog}>
            {
                achievements && achievements.map((row, index) => (

                    <div
                        key={index}
                        className={classes.card}
                    >
                        <div className={classes.imgWrapper}>
                            <div className={classes.imgWrapperItem}>

                                <span style={{ marginTop: "8px" }} className={classes.editIcon} onClick={() => openModal(row)}>
                                    <MaterialSymbolsEditOutlineRounded className={classes.editIcon} fontSize={32} color='gold' />
                                </span>
                                <span className={classes.deleteIcon}>
                                    <MaterialSymbolsDeleteOutlineRounded className={classes.deleteIcon} style={{ marginTop: "10px" }} fontSize={32} color='red' cursor="pointer" onClick={() => openDeleteModal(row)} />
                                </span>

                            </div>
                            <div className={classes.wrapperImages}>
                                <input
                                    hidden
                                    ref={fileRef}
                                    accept='image/*'
                                    onChange={handleFileChange}
                                    type="file"
                                    id="picture"
                                />

                                <img
                                    className={classes.img}
                                    src={row.image}
                                    alt="Preview"
                                />

                            </div>
                        </div>
                    </div>
                ))
            }
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div>
    );
}

