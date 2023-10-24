import { Image, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { TAchievement, TGalleries } from '../../../../types/data';
import { axiosPrivate } from '../../../api/axiosPrivate';
import { getGalleries } from '../../../api/data';
import { convertImageToFileURL } from '../../../utils/helpers';
import MaterialSymbolsDeleteOutlineRounded from '../../icons/MaterialSymbolsDeleteOutlineRounded';
import MaterialSymbolsDownload from '../../icons/MaterialSymbolsDownload';
import MaterialSymbolsEditOutlineRounded from '../../icons/MaterialSymbolsEditOutlineRounded';
import classes from './GalleriesTable.module.css';
import "./style.css";

export default function GalleriesTable() {
    const [galleries, setGalleries] = useState<TGalleries[]>()
    const [previewURL, setPreviewImage] = useState<File>();
    const [, setLoading] = useState<boolean>(false)
    const [imageUrl, setImageUrl] = useState<string>("")

    const fileRef = useRef<HTMLInputElement | null>(null)

    const handleDelete = async (id: number) => {
        try {
            await axiosPrivate.delete(`/galleries/${id}/`)
            toast.success('Movafiqiyatli!')
            fetchData()
        } catch (error) {
            toast.error('O`chirishda xatolik yuz berdi!');
        }
    };

    const fetchData = async () => {
        try {
            const res = await getGalleries()
            setGalleries(res?.data)
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
            onConfirm: () => {
                handleDelete(e.id)
                fetchData()
            },
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

    const openModal = (e: TGalleries) => modals.openConfirmModal({
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
                            <Image
                                loading='lazy'
                                src={imageUrl ? imageUrl : e.image}
                                alt="Preview"
                            />
                    </div>
                </div>
            </>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => {
            postGalleries(e.id)
            fetchData()
        },
    });

    const postGalleries = async (id: number) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', previewURL!);
            await axiosPrivate.put(`/galleries/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Movafiqiyatli Qoshildi!');
            setLoading(false);
            fetchData();
        } catch (error) {
            const axiosError = error as AxiosError;
            const myError = axiosError.request?.status ?? 0;
            const errorNumber = Math.floor(myError / 100);
            if (errorNumber === 4) {
                toast.error('Xato malumot kiritildi!');
            } else if (errorNumber === 5) {
                toast.error('Uzir hatoliq yuz berdi!');
            } else {
                toast.error('Internet aloqasi yo`q!');
            }
            setLoading(false);
        }
    }

    return (
        <div className={classes.catalog}>
            {galleries && galleries.map((row) => (
                <div
                    key={row.id}
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
                            {row.image ? (
                                <img className={classes.img} src={row.image} alt="Preview" />
                            ) : <></>}
                        </div>
                    </div>
                </div>
            ))}
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div>
    );
}
