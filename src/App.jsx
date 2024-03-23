import { useState } from 'react';
import viteLogo from '/vite.svg';
import './App.css';

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
const banList = new Set([]);

function App() {
  var firstTime = true;
  const [currentImage, setCurrentImage] = useState('');
  const [dogName, setDogName] = useState('');
  const [dogTraits, setDogTraits] = useState({
    breed_group: '',
    height: '',
    weight: '',
  });
  const [changed, setChanged] = useState('');
  

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    var breed_groupT = json[0].breeds[0].breed_group;
    var heightT = json[0].breeds[0].height.imperial;
    var weightT = json[0].breeds[0].weight.imperial;
    console.log(json);
    if (firstTime || breed_groupT == null || breed_groupT == '' || banList.has(breed_groupT) || banList.has(heightT) || banList.has(weightT)) {
      makeQuery();
      firstTime = false;
    } else {
      if (json == null) {
        console.log("Oops! Something went wrong with that query, let's try again!");
      } else {
        setCurrentImage(json[0].url);
        //console.log(json[0]);
        setDogTraits({
          breed_group: breed_groupT,
          height: heightT,
          weight: weightT,
        });
        setDogName(json[0].breeds[0].name);
        // setPrevImages((images) => [...images, json.url]);
      }
    }
  };

  const makeQuery = () => {
    let query = `https://api.thedogapi.com/v1/images/search?api_key=${ACCESS_KEY}&has_breeds=1`;
    callAPI(query).catch(console.error);
  };

  const addToBan = (event) => {
    banList.add(event.target.innerHTML);
    console.log(banList);
  }

  return (
    <div className='appContainer'>
      <h1>Rando Dog Finder!</h1>
      <h1> {dogName} </h1>

      <div className='buttonContainer'>
          {dogTraits.breed_group ? (
            <button className='button' type="onSubmit" onClick={addToBan}>
              {dogTraits.breed_group}
            </button>
          ) : (
            <div></div>
          )}

          {dogTraits.height ? (
            <button className='button' type="onSubmit" onClick={addToBan}>
              {dogTraits.height + ' inches'}
            </button>
          ) : (
            <div></div>
          )}

          {dogTraits.weight ? (
            <button className='button' type="onSubmit" onClick={addToBan}>
              {dogTraits.weight + ' lbs'}
            </button>
          ) : (
            <div></div>
          )}
      </div>

      <br></br>
      {currentImage ? (
        <img 
          className='dogImage'
          src={currentImage}
          alt="Photo returned"
        />
      ) : (
        <div></div>
      )}

      <br></br>

      <button onClick={makeQuery}>Get Dog Photo</button>

      <br></br>
      
      { banList.size > 0 ? (
        <div>
          <h2 style={{color: 'lightpink'}}> Banned Traits: </h2>
            {Array.from(banList).map((item, index) => (
              <p>{item}</p>
            ))}
        </div>
      ) : (
        <div></div>
      )}

    </div>
  )
};

export default App;