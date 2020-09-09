import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import TaskEditor from "./TaskEditor";
import TaskView from "./TaskView";
import { Container, Row, Col, Form, Button, Image, Badge } from 'react-bootstrap';
import loading from "../images/loading1.gif";

// import EosComm from "../service/EosComm"
// import PropTypes from 'prop-types';
// import {connectContext} from './Context'
// import AppContext from '../App';
// import "./css/Task.css";
// import url from "../utils/url";
// import tasksJsonData  from "../testdata.json";

class Task extends Component {
  constructor(props) {
    super(props);
    // this.context = window.connect;
    this.state = {
      task: null,
      // bounty:[],
      requires: [],
      loginAccount: window.loginAccount, 
      editing: false,
      redirectToReferrer: false,
      control:"no"
    };

    this.handleEditClick = this.handleEditClick.bind(this);
    // this.handleRequireSubmit = this.handleRequireSubmit.bind(this);
    this.handleTaskSave = this.handleTaskSave.bind(this);
    this.handleTaskCancel = this.handleTaskCancel.bind(this);
    // this.refreshRequires = this.refreshRequires.bind(this);
    this.refreshTask = this.refreshTask.bind(this);
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleHateClick = this.handleHateClick.bind(this);

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleParticipateClick = this.handleParticipateClick.bind(this);
    this.handleWithdrawClick = this.handleWithdrawClick.bind(this);
    this.handleCheckClick = this.handleCheckClick.bind(this);
    this.handleAdjustClick = this.handleAdjustClick.bind(this);

    // this.recuAllocateb = this.recuAllocateb.bind(this);

    this.eoscomm = window.eoscomm; //new EosComm();
  }

  componentDidMount(){
    this.refreshTask();
  }


  // 获取任务详情
  refreshTask(){
    const taskId = this.props.match.params.id;
    // var taskData = tasksJsonData.tasks[taskId-1]; 
    alert("in refreshTask !!");
    alert("before task fetchData !!");
    this.eoscomm.fetchData('zjubcatask11', 'zjubcatask11', 'task').then(rowsdata => {
      console.log("task ", taskId, ": ", rowsdata[taskId - 1]);
      alert("before set task state!!");
      this.setState({
        task: rowsdata[taskId - 1] //jsonData.tasks
      });
    }).catch(e => {
      alert(e + " Task fetch data error,", e.message);
    })
  }

  // const account_name author, uint64_t task_id, string& likevote, string& hatevote
  handleLikeClick(){
    const taskId = this.props.match.params.id;
    let likes = parseInt(this.state.task.likevote) + 1 ;
    let hates = parseInt(this.state.task.hatevote) ;
      
    this.eoscomm.pushAction("updatevotes", {
      author: window.loginAccount.name, task_id: taskId,//this.state
      likevote: likes, hatevote: hates
    }).then(returndata => {
      console.log("3.Vote data updated:", returndata);
      // this.refreshTask();
      let newtask = {
        id: this.state.task.id,
        title: this.state.task.title,
        participants: this.state.task.participants,
        updatedat: this.state.task.updatedat,
        status: this.state.task.status,
        rolenumbers: this.state.task.rolenumbers,
        reward: this.state.task.reward,
        pledge: this.state.task.pledge,
        description: this.state.task.description,
        requires: this.state.task.requires,
        likevote: likes,
        hatevote: hates
      };
      this.setState({
        task: null
      });
      this.setState({
        task: newtask
      });
    });
  }

  handleHateClick(){
    const taskId = this.props.match.params.id;
    let likes = parseInt(this.state.task.likevote) ;
    let hates = parseInt(this.state.task.hatevote) + 1 ;

    this.eoscomm.pushAction("updatevotes", {
      author: window.loginAccount.name, task_id: taskId,//this.state
      likevote: likes, hatevote: hates
    }).then(returndata => {
      console.log("3.Vote data updated:", returndata);
      // this.refreshTask();
      let newtask = {
        id: this.state.task.id,
        title: this.state.task.title,
        participants: this.state.task.participants,
        updatedat: this.state.task.updatedat,
        status: this.state.task.status,
        rolenumbers: this.state.task.rolenumbers,
        reward: this.state.task.reward,
        pledge: this.state.task.pledge,
        description: this.state.task.description,
        requires: this.state.task.requires,
        likevote: likes,
        hatevote: hates
      };
      this.setState({
        task: null
      });
      this.setState({
        task: newtask
      });
    });
  }

  handleDeleteClick(){
    const taskId = this.props.match.params.id;
    let loginAlert = false;
    // this.eoscomm.connectAndLogin(loginAlert).then(loginAccount=>{
      this.eoscomm.pushAction("erase",{author:window.loginAccount.name, task_id:taskId}).then(returndata =>{//this.state
          console.log("3.Delete task message:",returndata);
          alert("Task has been deleted.");
          this.setState({
            redirectToReferrer: true
          });
      });
    // });
  }
  
  handleParticipateClick(){
    const taskId = this.props.match.params.id;
    this.eoscomm.pushAction("participate", {
      author: window.loginAccount.name, task_id: taskId,//this.state.
      participantname: this.props.userName
    }).then(returndata => {
      console.log("3.Paticipants data updated:", returndata);
      this.setState({
        task: null
      });
      this.refreshTask();
      this.setState({
        control: "after pushAction"
      });
    });
  }

  handleWithdrawClick(){
    const taskId = this.props.match.params.id;
    this.eoscomm.pushAction("withdraw", {
      author: window.loginAccount.name, task_id: taskId,//this.state.
      participantname: this.props.userName
    }).then(returndata => {
      console.log("3.Paticipants data updated:", returndata);
      this.setState({
        task: null
      });
      this.refreshTask();
    });
  }

  recuAllocateb(){
    var recuAllocateb = (i, bounty) => {
      const taskId = this.props.match.params.id;
      let loginAlert = false;
      if(i===0){
        // (const account_name author, uint64_t task_id, string& participantname, 
        // string distribution, string score)
        return this.eoscomm.connectAndLogin(loginAlert).then(loginAccount=>{
          // for(var i = 0; i<newBounty.length; i++){
            // console.log("allocate:",i);
            this.eoscomm.pushAction("allocateb",{author:window.loginAccount.name, task_id:taskId, //this.state
              participantname:bounty[0].username, 
              distribution:bounty[0].distribution, score:bounty[0].score});
            //   .then(returndata =>{
            //     console.log("3.Paticipants data updated:",returndata);
            //     // this.refreshTask();
            // })
          // }
        });
      }else{
        var thisBounty = bounty.pop();
        console.log("pop:",thisBounty);
        return recuAllocateb(i-1, bounty).then(()=>{
          this.eoscomm.connectAndLogin(loginAlert).then(loginAccount=>{
              this.eoscomm.pushAction("allocateb",{author:window.loginAccount.name, task_id:taskId, //this.state
                participantname:thisBounty.username, 
                distribution:thisBounty.distribution, score:thisBounty.score});
          });
        });
      }
    };
  }

  handleCheckClick(newAllBounty){
    const taskId = this.props.match.params.id;
    // this.eoscomm.connectAndLogin(loginAlert).then(loginAccount=>{
      this.eoscomm.pushAction("updatestatus",{author:window.loginAccount.name, task_id:taskId,//this.state
        status:"Done"}).then(returndata =>{
          console.log("3.Paticipants data updated:",returndata);
          this.setState({
            task: null
          });
          this.refreshTask();
      });
    // });
  }

  handleAdjustClick(){
    
  }

  // 让任务处于编辑态
  handleEditClick() {
    this.setState({
      editing: true
    });
  }

  // 保存编辑的任务
  handleTaskSave(data) {
    const id = this.props.match.params.id;
    this.saveTask(id, data);
  }

  // 取消编辑任务
  handleTaskCancel() {
    this.setState({
      editing: false
    });
  }

  // 同步任务的修改到服务器
  saveTask(id, data) {
    this.eoscomm.pushAction("update",
      {
        author: window.loginAccount.name, //this.state
        id: id,//
        // authorname: data.author.userName,
        title: data.title,
        status: data.status,
        rolenumbers: data.rolenumbers,
        reward: data.reward,
        pledge: data.pledge,
        updatedat: data.updatedat,
        requires: data.requires,
        // likevote: data.likevote,
        // hatevote: data.hatevote,
        description: data.description
      }).then(returndata => {//"selectatask",{author:loginAccount.name,task_id:6}
        console.log("3.Update task data:", returndata);
        this.setState({
          editing: false
        });
        let newtask = {
          id: id,
          title: data.title,
          participants: this.state.task.participants,
          updatedat: data.updatedat,
          status: data.status,
          rolenumbers: data.rolenumbers,
          reward: data.reward,
          pledge: data.pledge,
          description: data.description,
          requires: this.state.task.requires,
          likevote: this.state.task.likevote,
          hatevote: this.state.task.hatevote
        };
        this.setState({
          task: null
        });
        this.setState({
          task: newtask
        });
        // this.refreshTask();
      });
  }

  find(participants, somebody){
    for(var i=0; i<participants.length; i++){
      if(participants[i].username===somebody)
        return true;
    }
    return false;
  }

  render() {
    const { task, requires, editing } = this.state;
    const { userName } = this.props; //??? userId,
    // console.log("render task:",task);
    // console.log("render task.author:",task.author);
    if (!task) {
      let ingStyle = {
        height: '650px',
        fontSize: '20px'
        // text-align: "center"
      }
      return (
        <Container style={ingStyle}>
          <br/>
            <Container className="textCenter">
              <Row>
                <Col className="text-center">
                正在向区块链节点请求数据...
                </Col> 
              </Row>
              <Row>
                <Col className="text-center">
                  <Image alt="loading" src={loading} />
                </Col>
              </Row>
              <Row>
                <Col className="text-center">
                  如果本页面持续时间过长，请<strong>刷新页面</strong>。若刷新无果则说明网络故障或者Scatter登录失败。
                </Col>
              </Row>
            </Container>
          <br/>
        </Container>
      );
    }
    // const editable = userId == task.author.id;  //===
    const deletable = userName === task.participants[0].username && (task.status === "Before Executing");
    const editable = userName === task.participants[0].username;
    const participable = (task.status === "Before Executing") &&  !this.find(task.participants,userName) ;
    const withdrawable = (task.status === "Before Executing") && (this.find(task.participants, userName));
    const checkable = task.status === "After Executing" && editable;
    const adjustable = task.status === "Done" && editable;
    const { from } =  { from: { pathname: "/" } };
    if (this.state.redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <Container className="task">
        {/* <Container>
          {this.state.control}
        </Container> */}
        
        {/* 在React中直接输出一个Object会导致：Objects are not valid as a React child  */}
        {/* <div>{task}</div> */}
        {/* <div>{task.author}</div> */}
        {editing ? (
          <TaskEditor
            task={task}
            onSave={this.handleTaskSave}
            onCancel={this.handleTaskCancel}
            //userId={userId}
            userName={userName}
          />
        ) : (
          <TaskView
            task={task}
            deletable={deletable}
            editable={editable}
            participable={participable}
            withdrawable={withdrawable}
            checkable={checkable}
            adjustable={adjustable}
            
            onEditClick={this.handleEditClick}
            onLikeClick={this.handleLikeClick}
            onHateClick={this.handleHateClick}

            onDeleteClick={this.handleDeleteClick}
            onPaticipateClick={this.handleParticipateClick}
            onWithdrawClick={this.handleWithdrawClick}
            onCheckClick={this.handleCheckClick}
            onAdjustClick={this.handleAdjustClick}
          />
        )}

        {/* <ThemeSwitcher/> */}

      </Container>
    );
  }
}

export default Task;

// Task.contextType = connectContext;

// Task.contextType = {
//   eoscomm: PropTypes.object,
//   loginAccount: PropTypes.object
// };

