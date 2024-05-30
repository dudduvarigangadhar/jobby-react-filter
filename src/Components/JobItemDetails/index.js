import Cookies from 'js-cookie'
import {Component} from 'react'
import {FaStar} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'
import {IoLocation} from 'react-icons/io5'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiConstantsStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    isJobDetails: apiConstantsStatus.initial,
    jobsDetails: [],
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  updatedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    description: data.life_at_company.description,
    imageUrl: data.life_at_company.image_url,

    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
    title: data.title,
  })

  updatedSimilarJobs = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getJobDetails = async () => {
    this.setState({
      isJobDetails: apiConstantsStatus.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const jobsItemUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobsItemUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = this.updatedData(data.job_details)
      const updatedSimilarData = data.similar_jobs.map(eachSimilarJobs =>
        this.updatedSimilarJobs(eachSimilarJobs),
      )
      this.setState({
        jobsDetails: updatedData,
        similarJobs: updatedSimilarData,
        isJobDetails: apiConstantsStatus.success,
      })
    } else {
      this.setState({
        isJobDetails: apiConstantsStatus.failure,
      })
    }
  }

  renderJobDetailsView = () => {
    const {isJobDetails} = this.state
    switch (isJobDetails) {
      case apiConstantsStatus.success:
        return this.renderSuccessFulJobsView()
      case apiConstantsStatus.failure:
        return this.renderFailureJobsView()
      case apiConstantsStatus.inProgress:
        return this.renderLoadingJobsView()
      default:
        return null
    }
  }

  renderSkillCard = eachSkill => {
    //   const {skills} = jobsDetails
    const {name, imageUrl} = eachSkill
    return (
      <li className="list-item-container">
        <img src={imageUrl} alt="skill logo" className="skill-img" />
        <p className="skill-name">{name}</p>
      </li>
    )
  }

  renderSimilarJobCard = eachSimilarJob => {
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      title,
    } = eachSimilarJob

    return (
      <div className="similarJob-container">
        <div className="job-details-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="jobDetails-company-logo"
          />
          <div className="job-details-rating-jobType-container">
            <h1 className="job-details-employment">{title}</h1>
            <div className="job-details-rating-container">
              <FaStar className="rating-star-img" />
              <p className="jobs-details-rating">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="similarJob-description-heading">Description</h1>
        <p className="similarJob-description">{jobDescription}</p>

        <div className="job-details-locationAndJob-container">
          <div className="job-details-location-container">
            <IoLocation className="job-details-location-icon " />
            <p className="job-details-location">{location}</p>
          </div>
          <div className="job-details-briefcase-container">
            <BsBriefcaseFill className="job-details-briefcase-icon" />
            <p className="job-details-jobType">{employmentType}</p>
          </div>
        </div>
      </div>
    )
  }

  renderSuccessFulJobsView = () => {
    const {jobsDetails, similarJobs} = this.state
    const skillsData = jobsDetails.skills
    console.log(skillsData)
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      description,
      imageUrl,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
    } = jobsDetails

    return (
      <div className="jobs-item-details-container">
        <div className="job-details-mini-container">
          <div className="job-details-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="jobDetails-company-logo"
            />
            <div className="job-details-rating-jobType-container">
              <h1 className="job-details-employment">{title}</h1>
              <div className="job-details-rating-container">
                <FaStar className="rating-star-img" />
                <p className="jobs-details-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details-locationAndPackage-container">
            <div className="job-details-locationAndJob-container">
              <div className="job-details-location-container">
                <IoLocation className="job-details-location-icon " />
                <p className="job-details-location">{location}</p>
              </div>
              <div className="job-details-briefcase-container">
                <BsBriefcaseFill className="job-details-briefcase-icon" />
                <p className="job-details-jobType">{employmentType}</p>
              </div>
            </div>
            <p className="job-details-package-amount">{packagePerAnnum}</p>
          </div>
          <hr />
          <div>
            <div className="description-website-container">
              <h1 className="job-details-description-heading">Description</h1>
              <a href={companyWebsiteUrl} className="external-link-icon">
                Visit
                <FiExternalLink size={20} />
              </a>
              <a href={companyWebsiteUrl} className="external-link-icon2">
                Visit
                <FiExternalLink size={15} />
              </a>
            </div>
            <p className="job-details-description">{jobDescription}</p>
          </div>
          <h1 className="skills-heading">Skills</h1>
          <div className="list-container">
            {skills.map(eachSkill => this.renderSkillCard(eachSkill))}
          </div>
          <div>
            <h1 className="lifeAtCompany-heading">Life at Company</h1>
            <div className="lifeAtCompany-container">
              <p className="lifeAtCompany-description">{description}</p>
              <img
                src={imageUrl}
                alt="lifeAtCompanyImage"
                className="lifeAtCompany-img"
              />
            </div>
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <div className="similarJobs-flex-container">
          {similarJobs.map(eachSimilarJobs =>
            this.renderSimilarJobCard(eachSimilarJobs),
          )}
        </div>
      </div>
    )
  }

  renderLoadingJobsView = () => (
    <div className="similarJob-loader">
      <Loader type="ThreeDots" height={50} width={50} color="#f1f5f9" />
    </div>
  )

  renderFailureJobsView = () => (
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

  render() {
    return (
      <div className="bg-container">
        <Header />
        <div>{this.renderJobDetailsView()}</div>
      </div>
    )
  }
}

export default JobItemDetails
