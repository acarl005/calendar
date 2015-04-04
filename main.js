var sampleCalendar = [
{"day":"Monday","goals":['learn','do stuff','go to disneyland'],"sprint_name":"Javascript Fundamentals","week":1},
{"day":"Tuesday","goals":['idk man','have tea','whatever'],"sprint_name":"Fundamentals of Being a Boss","week":1},
{"day":"Wednesday","goals":['learn','do stuff','go to disneyland'],"sprint_name":"How to Make Cream Corn","week":1},
{"day":"Thursday","goals":['idk man','have tea','whatever'],"sprint_name":"Javascript Fundamentals Again","week":1}
];

var sampleChat = [
{ author: "acarl005", date: 'right now', text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."},
{ author: "acarl005", date: 'right now', text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."},
{ author: "acarl005", date: 'right now', text: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."}
];

var messagesRef = new Firebase('https://popping-fire-8919.firebaseio.com/');

messagesRef.limitToLast(1).on('child_added', function (snapshot) {
  console.log(snapshot.val());
});


var CommentForm = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text) {
      alert("there's no message");
      return;
    };
    this.refs.text.getDOMNode().value = '';
    this.props.submitted({'author': author, 'text': text, 'date': 'now'});
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" className="form-control" ref="author" placeholder="Anonymous" />
        </div>
        <div className="form-group">
          <textarea placeholder="chat stuff" rows="5" className="form-control" ref="text"></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Send </button>
      </form>
    );
  }
});

var ChatBox = React.createClass({
  getInitialState: function() {
    return {data: this.props.data}
  },
  componentDidMount: function() {
    var self = this;
    function loopsiloop(){
      setTimeout(function(){
        self.loadChatFromServer();
        loopsiloop();
      }, 3000);
    }
    loopsiloop();
  },
  handleSubmit: function(data) {
    console.log(data);
    data = JSON.stringify(data);
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: data,
      success: function(data) {
        console.log(data);
        this.loadChatFromServer();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  loadChatFromServer: function() {
    console.log('getting data from server');
    $.ajax({
      url: this.props.url,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    console.log('new array', this.state.data);
    var chatNodes = [];
    for (i in this.state.data) {
      var message = this.state.data[i];
      chatNodes.push(
        <div className="message" key={i} >
          <p className="chat author">{message.author} &nbsp; </p>
          <p className="chat date">{message.date}:</p><br />
          <p className="chat text">{message.text}</p>
        </div>
      );
    };
    return (
      <div className="col-lg-6">
        <h1>Chat with Cohort</h1>
        <div className="panel panel-primary">
          <div className="panel-body" id="chat-panel">
            {chatNodes}
          </div>
        </div>

        <CommentForm url={this.props.url} submitted={this.handleSubmit} />

      </div>
    );
  }
});

var Goals = React.createClass({

  render: function() {
    var goalNodes = this.props.theGoals.map(function(thisGoal, i) {
      return (
        <li key={i} >{thisGoal}</li>
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

  loadFromServer: function() {
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
    this.loadFromServer();
  },

  render: function() {
    var dayNodes = this.state.data.map(function(thisDay, i) {
      return (
        <div className="well" key={i}>
          <h4>{thisDay.day}</h4>
          <h5>{thisDay.sprint_name}</h5>

          <Goals theGoals={thisDay.goals}/>

        </div>
      );
    });
    return(
      <div className="col-lg-6">
        {this.props.children}
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4 id="month"> April </h4>
          </div>
          <div className="panel-body">
            {dayNodes}
          </div>
        </div>
      </div>
    );
  }

});

var APP = React.createClass({
  render: function() {
    return (
      <div className="row">
        <CalendarView url={this.props.calendarURL} data={this.props.calendarData}>
          <h1>My Calendar</h1>
        </CalendarView>
        <ChatBox url={this.props.chatURL} data={this.props.chatData} pollInterval={3000} />
      </div>
    );
  }
});

React.render(
  <APP
    calendarURL="https://popping-fire-8919.firebaseio.com/Codesmith.json"
    calendarData={sampleCalendar}
    chatURL="https://popping-fire-8919.firebaseio.com/Chatroom.json"
    chatData={sampleChat}
  />,
  document.getElementById('content')
);