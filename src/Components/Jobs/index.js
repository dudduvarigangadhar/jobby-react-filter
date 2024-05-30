import {IoIosSearch} from 'react-icons/io'

import Loader from 'react-loader-spinner'

import {Component} from 'react'

import Cookies from 'js-cookie'

import Header from '../Header'

import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiConstantsStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const profileUrl = 'https://apis.ccbp.in/profile'
// let checkboxInputs = ''
class Jobs extends Component {
  state = {
    isProfile: apiConstantsStatus.initial,
    isJobs: apiConstantsStatus.initial,
    apiProfileData: [],
    apiJobData: [],
    searchInput: '',
    checkBoxInputs: [],
    radioInput: 0,
  }

  componentDidMount = () => {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({isProfile: apiConstantsStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(profileUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const profileData = data.profile_details
      const updatedProfileData = {
        name: profileData.name,
        profileImageUrl: profileData.profile_image_url,
        shortBio: profileData.short_bio,
      }
      //   console.log(profileData)
      this.setState({
        apiProfileData: updatedProfileData,
        isProfile: apiConstantsStatus.success,
      })
    } else {
      this.setState({isProfile: apiConstantsStatus.failure})
    }
  }

  getJobs = async () => {
    this.setState({isJobs: apiConstantsStatus.inProgress})
    const {checkBoxInputs, radioInput, searchInput} = this.state
    console.log(checkBoxInputs)
    const jwtToken = Cookies.get('jwt_token')

    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInputs.join()}&minimum_package=${radioInput}&search=${searchInput}`
    const jobOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const jobResponse = await fetch(jobsUrl, jobOptions)

    if (jobResponse.ok === true) {
      const data = await jobResponse.json()
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        apiJobData: updatedJobsData,
        isJobs: apiConstantsStatus.success,
      })
    } else {
      this.setState({
        isJobs: apiConstantsStatus.failure,
      })
    }
  }

  renderJobsViews = () => {
    const {isJobs} = this.state
    switch (isJobs) {
      case apiConstantsStatus.inProgress:
        return this.renderLoadingView()
      case apiConstantsStatus.success:
        return this.renderJobSuccessView()
      case apiConstantsStatus.failure:
        return this.renderJobFailureView()
      default:
        return null
    }
  }

  renderJobSuccessView = () => {
    const {apiJobData} = this.state
    // console.log(apiJobData)
    const renderJobsList = apiJobData.length > 0
    return renderJobsList ? (
      <div>
        {apiJobData.map(eachJob => (
          <JobItem eachJob={eachJob} key={eachJob.id} />
        ))}
      </div>
    ) : (
      <div className="no-jobs-container">
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-img"
          />
          <h1 className="no-jobs-heading">No Jobs Found</h1>
          <p className="no-jobs-description">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      </div>
    )
  }

  renderJobFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="jobs-retry-button">
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {apiProfileData} = this.state
    const {name, profileImageUrl, shortBio} = apiProfileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profileImage" />
        <h1 className="profileName">{name}</h1>
        <p className="profileBio">{shortBio}</p>
      </div>
    )
  }

  onRetryBtn = () => {
    this.getProfile()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <button type="button" className="retry-btn" onClick={this.onRetryBtn}>
        Retry
      </button>
    </div>
  )

  renderProfileViews = () => {
    const {isProfile} = this.state
    switch (isProfile) {
      case apiConstantsStatus.inProgress:
        return this.renderLoadingView()
      case apiConstantsStatus.failure:
        return this.renderFailureView()
      case apiConstantsStatus.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  onChangeCheckbox = event => {
    this.setState(
      prevState => ({
        checkBoxInputs: [...prevState.checkBoxInputs, event.target.value],
      }),
      this.getJobs,
    )
  }

  renderCheckbox = () =>
    employmentTypesList.map(eachItem => (
      <li className="list-container" key={eachItem.employmentTypeId}>
        <input
          type="checkbox"
          className="checkbox-container"
          value={eachItem.label}
          onClick={this.onChangeCheckbox}
          id={eachItem.employmentTypeId}
        />
        <label htmlFor={eachItem.employmentTypeId} className="labelText">
          {eachItem.label}
        </label>
      </li>
    ))

  onChangeSalary = event => {
    // console.log(event.target.value)
    this.setState({radioInput: event.target.value}, this.getJobs)
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  renderSalaryRange = () =>
    salaryRangesList.map(eachItem => (
      <li className="salary-container" key={eachItem.salaryRangeId}>
        <input
          type="radio"
          name="salary"
          value={eachItem.label}
          className="radio-container"
          id={eachItem.salaryRangeId}
          onClick={this.onChangeSalary}
        />
        <label htmlFor={eachItem.salaryRangeId} className="salaryText">
          {eachItem.label}
        </label>
      </li>
    ))

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
    // console.log(event.target.value)
  }

  onSearchCategory = () => {
    // const {searchInput} = this.state
    //   this.setState({apiJobData: })
    this.getJobs()
  }

  render() {
    const {apiJobData, searchInput} = this.state
    console.log(apiJobData)
    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-and-jobListContainer">
          <div className="profileSectionAndSpecification">
            <div className="sm-search-container">
              <div className="searchField-container">
                <input
                  type="search"
                  className="searchField"
                  placeholder="Search"
                  value={searchInput}
                  onChange={this.onChangeSearch}
                  onKeyDown={this.onEnterSearchInput}
                />
                <IoIosSearch
                  size={20}
                  className="search-icon"
                  onClick={this.onSearchCategory}
                />
              </div>
            </div>
            {this.renderProfileViews()}
            <hr className="horizontal-line" />
            <h1 className="typeOfEmployment">Type of Employment</h1>
            {this.renderCheckbox()}
            <hr className="horizontal-line" />
            <h1 className="salaryRange">Salary Range</h1>
            {this.renderSalaryRange()}
            <div className="sm-renderJobs-container">
              {this.renderJobsViews()}
            </div>
          </div>
          <div className="jobs-list-container">
            <div className="searchField-container">
              <input
                type="search"
                className="searchField"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearch}
                onKeyDown={this.onEnterSearchInput}
              />
              <IoIosSearch
                size={20}
                className="search-icon"
                onClick={this.onSearchCategory}
              />
            </div>
            <div className="lg-renderJobs-container">
              {this.renderJobsViews()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
