const bg = 'bg-gradient-to-br'
const gradients = [`${bg} from-pink-500 to-rose-500`, `${bg} from-sky-500 to-indigo-500`, `${bg} from-violet-500 to-fuchsia-500`, `${bg} from-purple-500 to-pink-500`]
const getRandomBg = ()=>{
  return gradients[Math.floor(Math.random() * (gradients.length - 1))]
}
export default getRandomBg
export { gradients}
