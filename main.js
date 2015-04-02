var sample = [
{"day":"Monday","goals":['learn','do stuff','go to disneyland'],"sprint_name":"Javascript Fundamentals","week":1},
{"day":"Tuesday","goals":['idk man','have tea','whatever'],"sprint_name":"Fundamentals of Being a Boss","week":1},
{"day":"Wednesday","goals":['learn','do stuff','go to disneyland'],"sprint_name":"How to Make Cream Corn","week":1},
{"day":"Thursday","goals":['idk man','have tea','whatever'],"sprint_name":"Javascript Fundamentals Again","week":1}
];

var Goals = React.createClass ({
  render: function() {
    var goalNodes = this.props.theGoals.map(function(thisGoal) {
      return (
        <li>{thisGoal}</li>
      );
    });
    return (
      <ol>
        {goalNodes}
      </ol>
    );
  }
});

var CalendarView = React.createClass({
  getInitialState: function() {
    return {data: [{goals:['loading']}]};
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  render: function() {
    var dayNodes = this.state.data.map(function (thisDay) {
      return (
        <div className="well">
          <h4>{thisDay.day}</h4>
          <h5>{thisDay.sprint_name}</h5>
          <ol>
            <Goals theGoals={thisDay.goals}/>
          </ol>
        </div>
      );
    }.bind(this));
    return(
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h4 id="month"> April </h4>
        </div>
        <div className="panel-body">
          {dayNodes}
        </div>
      </div>
    );
  }
});

React.render(
  <CalendarView url="https://popping-fire-8919.firebaseio.com/Codesmith.json" data="sample" />,
  document.getElementById('content')
);