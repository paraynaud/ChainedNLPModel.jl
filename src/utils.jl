"""
    create_minibatch(X, Y, p)

Create a minibatch's iterator of the data `X,Y` where each minibatch size is `1/p * length(Y)`.
"""
create_minibatch(x_data, y_data, minibatch_size) =
  minibatch(x_data, y_data, minibatch_size; xsize = (size(x_data, 1), size(x_data, 2), 1, :))

"""
    vector_params(chain :: C) where C <: Chain
    vector_params(nlp :: K) where K <: AbstractKnetNLPModel

Retrieve the variables within `chain` or `nlp.chain` as a vector.
"""
vector_params(chain::C) where {C <: Chain} = Array(vcat_arrays_vector(params(chain)))
vector_params(nlp::K) where {T<:Number, S, K <: AbstractKnetNLPModel{T, S}} = nlp.w

"""
    vcat_arrays_vector(arrays_vector)

Flatten a vector of arrays `arrays_vector` to a vector.
It concatenates the vectors produced by the application of `Knet.cat1d` to each array.
"""
vcat_arrays_vector(arrays_vector) = vcat(Knet.cat1d.(arrays_vector)...)

"""
    reset_minibatch_train!(nlp <: AbstractKnetNLPModel)

Select a new training minibatch for `nlp`.
Typically used before a new evaluation of the loss function/gradient.
"""
reset_minibatch_train!(nlp::T) where {T <: AbstractKnetNLPModel} =
  nlp.current_minibatch_training = rand(nlp.minibatch_train)

"""
    reset_minibatch_test!(nlp <: AbstractKnetNLPModel)

Select a new test minibatch for `nlp`.
"""
reset_minibatch_test!(nlp::T) where {T <: AbstractKnetNLPModel} =
  nlp.current_minibatch_testing = rand(nlp.minibatch_test)

"""
    accuracy(nlp <: AbstractKnetNLPModel)

Compute the accuracy of the network `nlp.chain` given the full test dataset `nlp.data_test`.
"""
accuracy(nlp::T) where {T <: AbstractKnetNLPModel} =
  Knet.accuracy(nlp.chain; data = nlp.minibatch_test)

"""
    build_layer_from_vec(v :: Vector{T}, var_layers :: CuArray{T, N, CUDA.Mem.DeviceBuffer} where N, index :: Int) where {T <: Number}

Inverse of the function `Knet.cat1d`; build a `CuArray` similar to `var_layers` from `v`.
The return values are those of the vector `v` in the range `index+1:index+consumed_index`.
This method is not optimized; it allocates memory.
"""
function build_layer_from_vec(
  v::Vector{T},
  var_layers::CuArray{T, N, CUDA.Mem.DeviceBuffer} where {N},
  index::Int,
) where {T <: Number}
  dims = ndims(var_layers)
  size_var_layers = size(var_layers)
  tmp_array = Array{T, dims}(undef, size_var_layers)
  cuArray = CuArray(tmp_array)
  product_dims = build_layer_from_vec!(cuArray, v, index)
  return (cuArray, product_dims)
end

function build_layer_from_vec(
  v::Vector{T},
  var_layers::Array{T, N} where {N},
  index::Int,
) where {T <: Number}
  dims = ndims(var_layers)
  size_var_layers = size(var_layers)
  tmp_array = Array{T, dims}(undef, size_var_layers)
  product_dims = build_layer_from_vec!(tmp_array, v, index)
  return (tmp_array, product_dims)
end

function build_layer_from_vec!(myArray ::Array{T, N} where N, v :: Vector{T}, index :: Int) where {T <: Number}
	sizeArray = reduce(*, size(myArray))
	copyto!(myArray, v[index+1:index+sizeArray])
  return sizeArray
end

function build_layer_from_vec!(
  myArray::A,
  v::Vector{T},
  index::Int,
) where {T <: Number, A <: AbstractArray{T}}
  sizeArray = reduce(*, size(myArray))
  copyto!(myArray, v[(index + 1):(index + sizeArray)])
  return sizeArray
end


"""
    build_layer_from_vec!(array, v :: Vector{T}, index :: Int) where {T <: Number}

Inverse of the function `Knet.cat1d`; set `array` to the values of `v` in the range `index+1:index+consumed_index`.
"""
function build_layer_from_vec!(
  myArray::A,
  v::Vector{T},
  index::Int,
) where {T <: Number, A <: AbstractArray{T}}
  sizeArray = reduce(*, size(myArray))
  copyto!(myArray, v[(index + 1):(index + sizeArray)])
  return sizeArray
end


"""
    build_nested_array_from_vec(chain_ANN :: C, v :: Vector{T}) where {C <: Chain, T <: Number}
    build_nested_array_from_vec(model <: AbstractKnetNLPModel{T, S}, v :: Vector{T}) where {T, S}
    build_nested_array_from_vec(nested_array :: Vector{CuArray{T, N, CUDA.Mem.DeviceBuffer} where N}, v :: Vector{T}) where {T <: Number}
    build_nested_array_from_vec(nested_array :: Vector{Array{T, N} where N}, v::Vector{T}) where {T <: Number}

Build a vector of `array` (or `cuArray`) from `v` similar to `Knet.params(model.chain)`, `Knet.params(chain_ANN)` or `nested_array`.
Call iteratively `build_layer_from_vec` to build each intermediate `CuArray`.
This method is not optimized; it allocates memory.
"""
build_nested_array_from_vec(model::K, v::Vector{T}) where {T<:Number, S, K <: AbstractKnetNLPModel{T, S}} = #{T <: AbstractKnetNLPModel}
  build_nested_array_from_vec(model.chain, v)

function build_nested_array_from_vec(chain_ANN::C, v::Vector{T}) where {C <: Chain, T <: Number}
  param_chain = params(chain_ANN) # :: Param
  size_param = mapreduce((var_layer -> reduce(*, size(var_layer))), +, param_chain)
  size_param == length(v) || error(
    "Dimension of Vector v mismatch, function rebuild_nested_array $(size_param) != $(length(v))",
  )

  param_value = (x -> x.value).(param_chain) # :: Vector{KnetArrays}
  vec_CuArray = build_nested_array_from_vec(param_value, v)
  return vec_CuArray
end

function build_nested_array_from_vec(
  nested_array::Vector{CuArray{T, N, CUDA.Mem.DeviceBuffer} where N},
  v::Vector{T},
) where {T <: Number}
  vec_CuArray = map(i -> similar(nested_array[i]), 1:length(nested_array))
  build_nested_array_from_vec!(vec_CuArray, v)
  return vec_CuArray
end

function build_nested_array_from_vec(
  nested_array::Vector{Array{T, N} where N},
  v::Vector{T},
) where {T <: Number}
  vec_Array = map(i -> similar(nested_array[i]), 1:length(nested_array))
  build_nested_array_from_vec!(vec_Array, v)
  return vec_Array
end

"""
    build_nested_array_from_vec!(vec_CuArray :: Vector{CuArray{T, N, CUDA.Mem.DeviceBuffer} where N}, new_w :: Vector{T}) where {T <: Number}
    build_nested_array_from_vec!(vec_Array :: Vector{Array{T, N} where N}, new_w :: Vector{T}) where {T <: Number}
    build_nested_array_from_vec!(model :: KnetNLPModel{T, S, C}, new_w :: Vector{T}) where {T, S, C}

Build a vector of `CuArray` (resp. `Array`) from `new_w` similar to `Knet.params(model.chain)` or `vec_CuArray` (resp. `vec_Array`).
Call iteratively `build_layer_from_vec!` to build each intermediate `CuArray` (resp. `Array`).
This method is not optimized; it allocates memory.
"""
build_nested_array_from_vec!(model::K, new_w::Vector{T}) where {T<:Number, S, K <: AbstractKnetNLPModel{T, S}} =
  build_nested_array_from_vec!(model.nested_cuArray, new_w)

function build_nested_array_from_vec!(
  vec_CuArray::Vector{CuArray{T, N, CUDA.Mem.DeviceBuffer} where N},
  v::Vector{T},
) where {T <: Number}
  index = 0
  for variable_layer in vec_CuArray
    consumed_indices = build_layer_from_vec!(variable_layer, v, index)
    index += consumed_indices
  end
end

function build_nested_array_from_vec!(
  vec_Array::Vector{Array{T, N} where N},
  v::Vector{T},
) where {T <: Number}
  index = 0
  for variable_layer in vec_Array
    consumed_indices = build_layer_from_vec!(variable_layer, v, index)
    index += consumed_indices
  end
end

function build_nested_array_from_vec!(
  vec_Array::Vector{Array{T, N} where N},
  v::Vector{T},
) where {T <: Number}
  index = 0
  for variable_layer in vec_Array
    consumed_indices = build_layer_from_vec!(variable_layer, v, index)
    index += consumed_indices
  end
end
"""
    set_vars!(model :: KnetNLPModel{T, S, C}, new_w :: Vector) where {T, S, C}
    set_vars!(chain_ANN :: C, nested_w :: Vector{CuArray{T, N, CUDA.Mem.DeviceBuffer} where N}) where {C <: Chain, T <: Number}
    set_vars!(chain_ANN :: C, nested_w :: Vector{Array{T, N} where N}) where {C <: Chain, T <: Number}
    set_vars!(vars :: Vector{Param}, nested_w :: Vector{CuArray{T, N, CUDA.Mem.DeviceBuffer} where N}) where {T <: Number}
    set_vars!(vars :: Vector{Param}, new_w :: Vector{Array{T, N} where N}) where {T <: Number}

Set the variables of `model` (resp. `chain_ANN` and `vars`) to `new_w` (resp. `nested_w`).
Build `nested_w`: a vector of `CuArrays` from `new_v` similar to `Knet.params(model.chain)`.
Then, set the variables `vars` of the neural netword `chain_ANN, model` to `new_w, nested_w`.
"""
set_vars!(
  vars::Vector{Param},
  nested_w::Vector{CuArray{T, N, CUDA.Mem.DeviceBuffer} where N},
) where {T <: Number} = map(i -> vars[i].value .= nested_w[i], 1:length(vars))

set_vars!(
  chain_ANN::C,
  nested_w::Vector{CuArray{T, N, CUDA.Mem.DeviceBuffer} where N},
) where {C <: Chain, T <: Number} = set_vars!(params(chain_ANN), nested_w)

set_vars!(
  vars::Vector{Param},
  nested_w::Vector{Array{T, N} where N},
) where {T <: Number} = map(i -> vars[i].value .= nested_w[i], 1:length(vars))

set_vars!(
  chain_ANN::C,
  nested_w::Vector{Array{T, N} where N}
) where {C <: Chain, T <: Number} = set_vars!(params(chain_ANN), nested_w)

function set_vars!(model::K, new_w::Vector{T}) where {T<:Number, S, K <: AbstractKnetNLPModel{T, S}}
  build_nested_array_from_vec!(model, new_w)
  set_vars!(model.chain, model.nested_cuArray)
  model.w .= new_w
end
