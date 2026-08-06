import { motion } from 'framer-motion'
import { useModal } from '@/components/ui/modal'
import { DonateContent } from './ActionAside'

export function InlineDonate() {
  const { present } = useModal()

  const openDonate = () => {
    present({
      content: <DonateContent />,
    })
  }

  return (
    <motion.button
      type="button"
      onClick={openDonate}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="mx-auto block lg:hidden px-6 py-3 bg-transparent hover:bg-accent/10 transition-colors text-accent text-sm font-medium border-0"
    >
      <i className="iconfont icon-user-heart mr-2" />
      buy me a cup of coffee
    </motion.button>
  )
}
