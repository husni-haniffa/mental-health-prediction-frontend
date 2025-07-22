import MentalHealthForm from './MentalHealthAssessment'
import ReadMe from './ReadMe'

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 gap-12">
        <MentalHealthForm/>
        <ReadMe/>
    </div>
  )
}

export default App