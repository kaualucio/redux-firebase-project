import './index.scss'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Messages from '../../components/Messages/Messages';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectImmobileById, updateImmobile } from '../../reducers/immobiles/immobilesSlice';
import { uploadImage } from '../../utils/uploadImage';
import { selectAllResidents } from '../../reducers/residents/residentsSlice';

interface MessageData {
  type: string,
  message: string
}

export default function UpdateImmobile() {
  const {id} = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const immobile = useAppSelector(state => selectImmobileById(state, id))
  const residents = useAppSelector(selectAllResidents)
  useEffect(() => {
    if(!immobile) {
      navigate('/imoveis')
    }
  }, [])

  const [name, setName] = useState(immobile?.name)
  const [immobilePhoto, setImmobilePhoto] = useState<File | null | string | undefined>(immobile?.image);
  const [rooms, setRooms] = useState(immobile?.rooms)
  const [address, setAddress] = useState(immobile?.address)
  const [cep, setCep] = useState(immobile?.cep)
  const [bathrooms, setBathrooms] = useState(immobile?.bathrooms)
  const [sqrMeters, setSqrMeters] = useState(immobile?.sqrMeters)
  const [price, setPrice] = useState(immobile?.price)
  const [hasPool, setHasPool] = useState(immobile?.pool)
  const [animals, setAnimals] = useState(immobile?.animals)
  const [hasYard, setHasYard] = useState(immobile?.yard)
  const [isAvailable, setIsAvailable] = useState<boolean | null | undefined>(immobile?.status)
  const [currentResident, setCurrentResident] = useState<string | null | undefined>(isAvailable ? immobile?.resident : null)
  const [message, setMessage] = useState<MessageData>({type: '', message: ''})

  function handleChange (e: ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.files) {
      setImmobilePhoto(e.currentTarget.files[0]);
    }
  };

  async function handleUpdateImmobile(e: FormEvent) {
    e.preventDefault()
    try {
      let newUrlImage: string | null = null
      if(immobilePhoto && typeof immobilePhoto !== "string") {
        newUrlImage = await uploadImage(immobilePhoto)
      }

      if(id) {
        await dispatch(updateImmobile({
          updatedImmobile: {
            name,
            animals,
            rooms,
            address,
            cep,
            bathrooms,
            pool: hasPool,
            yard: hasYard,
            status: isAvailable,
            resident: currentResident !== '' ? currentResident : null,
            sqrMeters,
            price,
            image: newUrlImage ? newUrlImage : immobilePhoto
          },
          collection: 'immobiles',
          immobileId: id
        })).unwrap()
      }
      setMessage({type: 'success', message: 'Im??vel editado com sucesso'})
    } catch (error) {
      setMessage({type: 'error', message: 'Houve um erro ao atualizar o im??vel'})
    }
  }

  return (
    <div className="register-immobile">
      <div className="title-container">
        <h2 className="title">Editar Im??vel - {immobile?.name}</h2>
        <Link className="link-button" to="/imoveis">Voltar</Link>
      </div>
      {message.message !== '' && <Messages dataMessage={message} />}
      <div className="form-container">
        <form onSubmit={handleUpdateImmobile}>
          <div className="form-image-select">
            <label htmlFor="photo">
              <DriveFolderUploadIcon fontSize="large" />
              Foto do im??vel
            </label>
            <input onChange={handleChange} type="file" name="photo" id="photo" />
          </div>
          <div>
            <label htmlFor="name">Nome</label>
            <input onChange={e => setName(e.target.value)} value={name} type="text" name="name" id="name" />
          </div>
          <div>
            <label htmlFor="address">Endere??o</label>
            <input onChange={e => setAddress(e.target.value)} value={address} type="text" name="address" id="address" />
          </div>
          <div>
            <label htmlFor="rooms">N?? Quartos</label>
            <input onChange={e => setRooms(Number(e.target.value))} value={rooms} type="number" name="rooms" id="rooms" />
          </div>
          <div>
            <label htmlFor="bathrooms">N?? Banheiros</label>
            <input onChange={e => setBathrooms(Number(e.target.value))} value={bathrooms} type="number" name="bathrooms" id="bathrooms" />
          </div>
          <div>
            <label htmlFor="meters">Tamanho (m&sup2;)</label>
            <input onChange={e => setSqrMeters(Number(e.target.value))} value={sqrMeters} type="number" name="meters" id="meters" />
          </div>
          <div>
            <label htmlFor="cep">CEP</label>
            <input onChange={e => setCep(e.target.value)} value={cep} type="text" name="cep" id="cep" />
          </div>
          <div>
            <label htmlFor="price">Pre??o (R$)</label>
            <input onChange={e => setPrice(Number(e.target.value))} value={price} type="number" name="price" id="price" />
          </div>
          <div>
            <label htmlFor="pool">Piscina</label>
            <div className="radio-type">
              <div>
                <input type="radio" name="pool" id="pool" value="sim" checked={hasPool === true} onChange={e => setHasPool(Boolean(e.currentTarget.value === 'sim'))} /> Sim
              </div>
              <div>
                <input type="radio" name="pool" id="pool" value="n??o" checked={hasPool === false} onChange={e => setHasPool(Boolean(e.currentTarget.value === 'sim'))} /> N??o
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="yard">Quintal</label>
            <div className="radio-type">
              <div>
                <input type="radio" name="yard" id="yard" value="sim" checked={hasYard === true} onChange={e => setHasYard(Boolean(e.currentTarget.value === 'sim'))} /> Sim
              </div>
              <div>
                <input type="radio" name="yard" id="yard" value="n??o" checked={hasYard === false} onChange={e => setHasYard(Boolean(e.currentTarget.value === 'sim'))} /> N??o
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="animals">Animais</label>
            <div className="radio-type">
              <div>
                <input type="radio" name="garage" id="garage" value="sim" checked={animals === true} onChange={e => setAnimals(Boolean(e.currentTarget.value === 'sim'))} /> Sim
              </div>
              <div>
                <input type="radio" name="garage" id="garage" value="n??o" checked={animals === false} onChange={e => setAnimals(Boolean(e.currentTarget.value === 'sim'))} /> N??o
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="status">Dispon??vel</label>
            <div className="radio-type">
              <div>
                <input type="radio" name="status" id="status" value="sim" checked={isAvailable === true} onChange={e => setIsAvailable(Boolean(e.currentTarget.value === 'sim'))} /> Sim
              </div>
              <div>
                <input type="radio" name="status" id="status" value="n??o" checked={isAvailable === false} onChange={e => setIsAvailable(Boolean(e.currentTarget.value === 'sim'))}/> N??o
              </div>
            </div>
            {/* Se sim mostrar essa div */}
            <div className={`select-resident ${isAvailable ? 'none' : ''}`}>
                <label htmlFor="resident">Quem mora nesse im??vel</label>
                <select onChange={e => setCurrentResident(e.target.value)} value={currentResident ? currentResident : ''} name="resident" id="resident">
                  <option value="">Selecione um residente</option>
                  {
                    residents?.map(resident => (
                      <option key={resident.id} value={resident.id}>{resident.name}</option>
                    ))
                  }
                </select>
              </div>
          </div>
          <div>
            <button type="submit">Atualizar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
