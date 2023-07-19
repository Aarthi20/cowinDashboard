// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    lastSevenDaysData: [],
    vaccinationByAgeList: [],
    vaccinationByGenderList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.last_7_days_vaccination.map(eachItem => ({
        vaccineDate: eachItem.vaccine_date,
        dose1: eachItem.dose_1,
        dose2: eachItem.dose_2,
      }))
      this.setState({
        lastSevenDaysData: formattedData,
        vaccinationByAgeList: data.vaccination_by_age,
        vaccinationByGenderList: data.vaccination_by_gender,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  SuccessView = () => {
    const {
      lastSevenDaysData,
      vaccinationByAgeList,
      vaccinationByGenderList,
    } = this.state

    return (
      <>
        <div className="success-container">
          <h1 className="vaccination-heading">Vaccination Coverage</h1>
          <VaccinationCoverage
            lastSevenDaysVaccinationData={lastSevenDaysData}
          />
        </div>
        <div className="success-container">
          <h1 className="vaccination-heading">Vaccination by gender</h1>
          <VaccinationByGender
            VaccinationByGenderData={vaccinationByGenderList}
          />
        </div>
        <div className="success-container">
          <h1 className="vaccination-heading">Vaccination by age</h1>
          <VaccinationByAge vaccinationByAgeListData={vaccinationByAgeList} />
        </div>
      </>
    )
  }

  FailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Something went wrong</h1>
    </div>
  )

  LoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderingViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.SuccessView()
      case apiStatusConstants.failure:
        return this.FailureView()
      case apiStatusConstants.inProgress:
        return this.LoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="over-all-container">
        <div className="cowin-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <p className="cowin-title">Co-WIN</p>
        </div>
        <h1 className="cowin-description">CoWin Vaccination in India</h1>
        {this.renderingViews()}
      </div>
    )
  }
}
export default CowinDashboard
