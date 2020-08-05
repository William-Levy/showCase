
class BusinessProfileList extends React.Component {
  state = {
    profileData: [],
    current: 1,
    total: "",
    pageSize: 9,
    pageIndex: 0,
    query: "",
  };

  componentDidMount() {
    this.getProfiles();
  }

  getProfiles = () => {
    profileService
      .getAllPaginate(this.state.pageSize, this.state.pageIndex)
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
  };

  searchQuery = () => {
    profileService
      .searchPaginated(
        this.state.pageSize,
        this.state.pageIndex,
        this.state.query
      )
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
  };

  onGetAllSuccess = (response) => {
  
    let profiles = response.data.item.pagedItems.map(this.mapProfiles);

    this.setState(() => {
      return {
        profileData: profiles,
        total: response.data.item.totalCount,
        pageIndex: response.data.item.pageIndex,
        query: response.data.item.query,
      };
    });
  };

  pageChange = (page) => {

    this.setState((prevState) => {
      return {
        ...prevState,
        current: page,
      };
    });

    profileService
      .getAllPaginate(this.state.pageSize, page - 1)
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
  };

  onGetAllError = (error) => {
    _logger(error);
  };

  mapProfile = (aProfile) => {
    
    return (
      <BusinessInfoCard
        profile={aProfile}
        id={aProfile.id}
        value={aProfile.id}
        key={aProfile.id}
      />
    );
  };

  mapProfiles = (aProfile) => {
    
    return (
      <BusinessProfileCard
        profile={aProfile}
        value={aProfile.id}
        showInfo={this.showInfo}
        updateHandler={this.updateHandler}
        key={aProfile.id}
        id={aProfile.id}
      />
    );
  };

  searchChangeHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    this.setState(() => {
      return {
        [name]: value,
      };
    });
  };

  onSearchClickHandler = (e) => {
    e.preventDefault();

    let query = this.state.query;

    this.props.history.push(`/business/profiles/search/${query}`);
  };

  showInfo = (event, profile) => {
    let targetId = event.currentTarget.id;

    this.props.history.push(`/business/profile/${targetId}`, profile);
  };

  onGetByIdSuccess = (response) => {    

    let profile = response.data.item.map(this.mapProfile);

    this.setState(() => {
      return {
        profileData: profile,
      };
    });
  };

  render() {
    return (
      <React.Fragment>
        <Jumbotron className="businessProfiles">
          <Navbar bg="light" expand="lg" className="profileNav">
            <h3 className="h3-title">Business Profiles</h3>
            <form className="form-inline">
              <input
                className="searchFilter form-control"
                type="search"
                name="query"
                placeholder="Search ..."
                onChange={this.searchChangeHandler}
              />
              <button
                className="search btn btn-primary"
                type="submit"
                onClick={this.onSearchClickHandler}
              >
                search
              </button>
            </form>
          </Navbar>
          <Container className="ProfileContainer row">
            {this.state.profileData}
          </Container>
          <br />
          <Container className="pag-footer">
            <div className="rc-pagination mb-2">
              {this.state.total > this.state.pageSize && (
                <Pagination
                  onChange={this.pageChange}
                  current={this.state.current}
                  pageIndex={this.state.pageIndex}
                  pageSize={this.state.pageSize}
                  total={this.state.total}
                  nextIcon={<i className="fa fa-chevron-right"></i>}
                  prevIcon={<i className="fa fa-chevron-left"></i>}
                  locale={localInfo}
                  style={{
                    margin: "auto",
                    color: "#ab8ce4",
                    borderColor: "#ab8ce4",
                  }}
                  className="col-sm-3"
                />
              )}
            </div>
          </Container>
        </Jumbotron>
      </React.Fragment>
    );
  }
}

BusinessProfileList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default BusinessProfileList;
